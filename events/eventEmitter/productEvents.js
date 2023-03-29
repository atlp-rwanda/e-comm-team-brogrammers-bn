/* eslint-disable no-use-before-define */
/* istanbul ignore file */
/* eslint-disable require-jsdoc */
/* istanbul ignore file */
import EventEmitter from 'events';
import 'dotenv/config';
// eslint-disable-next-line import/named
import { productsModal, cartsModal } from '../../src/database/models';

const schedule = require('node-schedule');

class Emitter extends EventEmitter {
  async setupSchedules() {
    schedule.scheduleJob(process.env.SCHEDULE_TIME, async () => {
      const products = await productsModal.findAll();
      products.forEach((data) => {
        const { id, expiryDate } = data.dataValues;
        const expDate = new Date(expiryDate).toLocaleDateString('en-US');
        const currentDate = new Date().toLocaleDateString('en-US');
        if (currentDate === expDate) {
          this.emit('productExpired', { id });
        }
      });
    });
  }

  checkDelayedProductInCart() {
    schedule.scheduleJob(process.env.SCHEDULE_TIME, async () => {
      const carts = await cartsModal.findAll();
      carts.forEach((cart) => {
        if (cart.items.length > 0) {
          const lastUpdated = new Date(cart.updatedAt);
          const delayingDate = new Date(
            parseInt(lastUpdated.getTime(), 10)
              + parseInt(process.env.PRODUCT_DELAY_IN_CART_PERIOD, 10)
          );
          const now = new Date();
          if (now >= delayingDate) {
            this.emit('productDelayedInCart', cart.buyerId);
          }
        }
      });
    });
  }
}

export default Emitter;
