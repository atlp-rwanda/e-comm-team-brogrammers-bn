import { Op } from 'sequelize';
import moment from 'moment';
// eslint-disable-next-line import/named
import { products, order, payments } from '../database/models';
import { ItemError, viewAllStatsGraph, viewAllStats } from '../loggers/status.logger';

/**
 * status
 */
export default class Status {
  /**
  * @param {object} req
     * @param {object} res
     * @returns {res} getting user status
  */
  static async getProductsStatus(req, res) {
    try {
      let end;
      let start;
      if (!req.query.end) end = new Date();
      else {
        end = new Date(req.query.end);
        end.setHours(23);
        end.setMinutes(59);
      }

      if (!req.query.start) {
        start = new Date(end);
        start.setHours(start.getHours() - 2);
      } else start = new Date(req.query.start);
      const allPayments = await payments.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end]
          }
        },
        include: {
          model: order,
          as: 'order',
          include: { model: products, as: 'products', }
        },
      });
      const allProducts = [];
      const product = allPayments
        .map((payment) => (payment.order.products))
        .flat(1)
        .filter((p) => (p.sellerId === req.user.id));
      product.forEach((p) => {
        if (allProducts.some((pro) => (p.id === pro.id))) {
          const index = allProducts.findIndex((object) => object.id === p.id);
          allProducts[index].orderitem.quantity += p.orderitem.quantity;
        } else {
          allProducts.push(p);
        }
      });
      const output = allProducts.map((p) => ({
        id: p.id,
        images: p.images,
        name: p.name,
        description: p.description,
        quantity: p.quantity,
        exp_date: p.exp_date,
        price: p.price,
        createdAt: p.createdAt,
        soldQuantity: p.orderitem.quantity,
        soldAmount: p.orderitem.quantity * p.price,
      })).sort((a, b) => (Number(b.soldAmount) - Number(a.soldAmount)));
      const revenue = output.reduce((out, current) => ({
        total: out.total + current.soldAmount,
        items: out.items + current.soldQuantity
      }), { total: 0, items: 0 });
      viewAllStats(req);
      return res.status(200).json({ products: output, revenue });
    } catch (error) {
      ItemError(req, error);
      return res.status(500).json({ error: 'Server error.' });
    }
  }

  /**
* @param {object} req
   * @param {object} res
   * @returns {res} getting user status with graph
*/
  static async getProductsStatusGraph(req, res) {
    try {
      const { range } = req.params;
      let end;
      let start;
      if (range === 'year') {
        end = new Date();
        end.setDate('1');
        end.setHours('00');
        end.setMinutes('00');
        end.setMonth(end.getMonth() + 1);
        start = new Date(end);
        start.setFullYear(start.getFullYear() - 1);
      } else if (range === 'month') {
        end = new Date();
        end.setHours('00');
        end.setMinutes('00');
        end.setDate(end.getDate() + 1);
        start = new Date(end);
        start.setMonth(start.getMonth() - 1);
      } else if (range === 'week') {
        end = new Date();
        end.setHours('00');
        end.setMinutes('00');
        end.setDate(end.getDate() + 1);
        start = new Date(end);
        start.setDate(start.getDate() - 7);
      } else {
        end = new Date();
        end.setMinutes('00');
        end.setHours(end.getHours() + 1);
        start = new Date(end);
        start.setDate(start.getDate() - 1);
      }
      const allPayments = await payments.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end]
          }
        },
        include: {
          model: order,
          as: 'order',
          include: { model: products, as: 'products', }
        },
        order: [['createdAt', 'ASC']]
      });
      let group = [];
      if (range === 'year') {
        // eslint-disable-next-line no-restricted-syntax
        for (const payment of allPayments) {
          const date = new Date(payment.createdAt);
          if (!group[date.getMonth()]) {
            group[date.getMonth()] = {
              name: moment(date).format('MMMM'),
              values: []
            };
          }
          group[date.getMonth()].values.push(payment);
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 12; i++) {
          if (!group[i] || group[i] === null) {
            group[i] = {
              name: moment().month(i).format('MMMM'),
              values: []
            };
          }
        }
        let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        months = months.concat(...months.splice(0, end.getMonth()));

        group = months.map((index) => group[index]);
      } else if (range === 'month') {
        // eslint-disable-next-line no-restricted-syntax
        for (const payment of allPayments) {
          const date = new Date(payment.createdAt);
          if (!group[date.getDate()]) {
            group[date.getDate()] = {
              name: moment(date).format('DD'),
              values: []
            };
          }
          group[date.getDate()].values.push(payment);
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 30; i++) {
          if (!group[i] || group[i] === null) {
            group[i] = {
              name: moment().date(i).format('DD'),
              values: []
            };
          }
        }
        let dates = Array.from({ length: 30 }, (value, index) => index);
        dates = dates.concat(...dates.splice(0, end.getDate()));
        group = dates.map((index) => group[index]);
      } else if (range === 'week') {
        // eslint-disable-next-line no-restricted-syntax
        for (const payment of allPayments) {
          const date = new Date(payment.createdAt);
          if (!group[date.getDay()]) {
            group[date.getDay()] = {
              name: moment(date).format('dddd'),
              values: []
            };
          }
          group[date.getDay()].values.push(payment);
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 7; i++) {
          if (!group[i] || group[i] === null) {
            group[i] = {
              name: moment().day(i).format('dddd'),
              values: []
            };
          }
        }
        let days = [
          0, 1, 2, 3, 4, 5, 6
        ];
        days = days.concat(...days.splice(0, end.getDay()));
        group = days.map((index) => group[index]);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const payment of allPayments) {
          const date = new Date(payment.createdAt);
          if (!group[date.getHours()]) {
            group[date.getHours()] = {
              name: moment(date).format('HH'),
              values: []
            };
          }
          group[date.getHours()].values.push(payment);
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 24; i++) {
          if (!group[i] || group[i] === null) {
            group[i] = {
              name: moment().hour(i).format('HH'),
              values: []
            };
          }
        }
        let hours = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
        ];
        hours = hours.concat(...hours.splice(0, end.getHours()));
        group = hours.map((index) => group[index]);
      }
      group.forEach((month) => {
        if (month.values) {
          month.values = month.values.map((payment) => (payment.order.products))
            .flat(1)
            .filter((p) => (p.sellerId === req.user.id));
          const allProducts = [];
          month.values.forEach((p) => {
            if (allProducts.some((pro) => (p.id === pro.id))) {
              const index = allProducts.findIndex((object) => object.id === p.id);
              allProducts[index].orderitem.quantity += p.orderitem.quantity;
            } else {
              allProducts.push(p);
            }
          });
          month.values = allProducts.map((p) => ({
            id: p.id,
            images: p.images,
            name: p.name,
            description: p.description,
            quantity: p.quantity,
            exp_date: p.exp_date,
            price: p.price,
            createdAt: p.createdAt,
            soldQuantity: p.orderitem.quantity,
            soldAmount: p.orderitem.quantity * p.price,
          })).sort((a, b) => (Number(b.soldAmount) - Number(a.soldAmount)));
          const revenue = month.values.reduce((out, current) => ({
            total: out.total + current.soldAmount,
            items: out.items + current.soldQuantity
          }), { total: 0, items: 0 });
          month.totalAmount = revenue.total;
          month.items = revenue.items;
        }
      });
      viewAllStatsGraph(req);
      return res.json(group);
    } catch (error) {
      ItemError(req, error);
      return res.status(500).json({ error: error.message });
    }
  }
}
