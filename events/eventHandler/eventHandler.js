/* istanbul ignore file */
/* eslint-disable no-console */

import { Op } from "sequelize";
import Emitter from "../eventEmitter/productEvents";
import { ProductServices, prodEmitter } from "../../services/productService";
import {
  Notification,
  User,
  Product,
  ProductWishes,
  Cart,
} from "../../database/models";
import SendEmail from "../../utils/email";
import { io } from "../../utils/socketio";

const eventObj = new Emitter();

eventObj.on("productExpired", async (data) => {
  try {
    await ProductServices.productExpired(data.id);
  } catch (error) {
    console.log(error);
  }
});

eventObj.setupSchedules();

eventObj.on("productDelayedInCart", async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    const userNot = await Notification.create({
      type: "Products Delayed In Cart",
      message:
        "You have products in the cart for more than two days, you can check on it",
      recipientId: id,
    });
    const savedNotification = await userNot.save();
    io.to(`user-${savedNotification.recipientId}`).emit(
      "productDelayedInCart",
      savedNotification.dataValues
    );
    const obj = {
      name: user.name,
      email: user.email,
      type: savedNotification.type,
      message: savedNotification.message,
    };
    await new SendEmail(obj, null, null).productDelayedInCart();
  } catch (error) {
    console.log(error);
  }
});

eventObj.checkDelayedProductInCart();

prodEmitter.on("productMadeExpired", async (data) => {
  try {
    const product = await Product.findOne({
      where: { id: data.id },
      attributes: ["id", "name", "images"],
      include: [
        {
          model: User,
          as: "seller",
        },
      ],
    });
    const { name, email, id } = product.seller;

    // The notification intended for the owner of the product
    const ownerNotification = await Notification.create({
      type: "Product Expired",
      message: `Your product ${product.name} is exppired`,
      recipientId: id,
    });
    const savedOwnerNotification = await ownerNotification.save();

    io.to(`user-${savedOwnerNotification.recipientId}`).emit(
      "productExpired",
      savedOwnerNotification.dataValues
    );

    // The notification intended for the buyers who added the product to the cart
    const existCarts = await Cart.findAll();
    existCarts.forEach((cart) => {
      cart.items.forEach(async (item) => {
        if (item.id === product.id) {
          const recipient = await User.findOne({
            where: { id: cart.buyerId },
            attributes: ["id", "name", "email"],
          });
          const notification = await Notification.create({
            type: "Product Expired",
            message: `The product ${product.name} of the seller ${name} you added to the cart is expired, remove it from the cart.`,
            recipientId: recipient.id,
          });
          const savedNotification = await notification.save();
          io.to(`user-${savedNotification.recipientId}`).emit(
            "productExpired",
            savedNotification.dataValues
          );
          const obj = {
            name: recipient.name,
            email: recipient.email,
            type: savedNotification.type,
            message: savedNotification.message,
            images: product.images,
          };
          await new SendEmail(obj, null, null).productMadeUnAvailable();
        }
      });
    });
    await new SendEmail(
      {
        name,
        email,
        images: product.images,
        message: savedOwnerNotification.message,
        type: savedOwnerNotification.type,
      },
      null,
      product.name
    ).expiredProduct();
    // The notification intended for the buyers who bought the product and is not yet derivered.
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("productMadeAvailable", async (data) => {
  try {
    const { seller, product } = data;

    const productWishList = await ProductWishes.findOne({
      where: { product_id: product.id },
      attributes: ["users"],
    });
    if (productWishList) {
      const recipients = productWishList.users.map((user) => JSON.parse(user));
      recipients.forEach(async (user) => {
        const notification = await Notification.create({
          type: "Product Available",
          message: `The product ${product.name} of the seller ${seller.name} you added to the wishlist is now available for sale`,
          recipientId: user.id,
        });
        const savedNotification = await notification.save();
        io.to(`user-${savedNotification.recipientId}`).emit(
          "productMadeAvailable",
          savedNotification.dataValues
        );
        const obj = {
          name: user.name,
          email: user.email,
          images: product.images,
          message: savedNotification.message,
          type: savedNotification.type,
        };
        await new SendEmail(obj, null, null).productMadeAvailable();
      });
    }
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("productMadeUnAvailable", async (data) => {
  try {
    const { seller, product } = data;
    const existCarts = await Cart.findAll();
    existCarts.forEach((cart) => {
      cart.items.forEach(async (item) => {
        if (item.id === product.id) {
          const recipient = await User.findOne({
            where: { id: cart.buyerId },
            attributes: ["id", "name", "email"],
          });
          const notification = await Notification.create({
            type: "Product Not Available",
            message: `The product ${product.name} of the seller ${seller.name} you added to the cart is not available for sale, remove it from the cart and add it to the wishlist, then we will notify you when it is available again.`,
            recipientId: recipient.id,
          });
          const savedNotification = await notification.save();
          io.to(`user-${savedNotification.recipientId}`).emit(
            "productMadeUnAvailable",
            savedNotification.dataValues
          );
          const obj = {
            name: recipient.name,
            email: recipient.email,
            type: savedNotification.type,
            message: savedNotification.message,
            images: product.images,
          };
          await new SendEmail(obj, null, null).productMadeUnAvailable();
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("addedToWishList", async (data) => {
  try {
    const { user, product_id } = data; // eslint-disable-line camelcase
    const product = await Product.findOne({
      where: { id: product_id },
      include: [
        {
          model: User,
          as: "seller",
        },
      ],
    });
    const notification = await Notification.create({
      type: "Product Added To Wishlist",
      message: `You added the product ${product.name} of the seller ${product.seller.name} to the wishlist.`,
      recipientId: user.id,
    });
    const savedNotification = await notification.save();
    io.to(`user-${savedNotification.recipientId}`).emit(
      "addedToWishList",
      savedNotification.dataValues
    );
    const obj = {
      name: user.name,
      email: user.email,
      type: savedNotification.type,
      message: savedNotification.message,
      images: product.images,
    };
    await new SendEmail(obj, null, null).wishList();
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("removedFromWishList", async (data) => {
  try {
    const { user, product_id } = data; // eslint-disable-line camelcase

    const product = await Product.findOne({
      where: { id: product_id },
      include: [
        {
          model: User,
          as: "seller",
        },
      ],
    });
    const notification = await Notification.create({
      type: "Product Removed From Wishlist",
      message: `You removed the product ${product.name} of the seller ${product.seller.name} to the wishlist.`,
      recipientId: user.id,
    });
    const savedNotification = await notification.save();
    io.to(`user-${savedNotification.recipientId}`).emit(
      "removedFromWishList",
      savedNotification.dataValues
    );
    const obj = {
      name: user.name,
      email: user.email,
      type: savedNotification.type,
      message: savedNotification.message,
      images: product.images,
    };
    await new SendEmail(obj, null, null).wishList();
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("productAdded", async (data) => {
  try {
    const { userInfo, product } = data;
    // The notification intended for the owner the product
    const ownerNotification = await Notification.create({
      type: "Product Added",
      message: `You added the product ${product.name} to the platform`,
      recipientId: userInfo.id,
    });
    const savedOwnerNotification = await ownerNotification.save();
    const userObj = {
      name: userInfo.name,
      email: userInfo.email,
      type: savedOwnerNotification.type,
      message: savedOwnerNotification.message,
      images: product.images,
    };
    io.to(`user-${savedOwnerNotification.recipientId}`).emit(
      "productAdded",
      savedOwnerNotification.dataValues
    );

    const recipients = await User.findAll({
      where: {
        role: {
          [Op.or]: ["admin", "buyer"],
        },
      },
      attributes: ["id", "name", "email"],
    });
    recipients.forEach(async (user) => {
      const notification = await Notification.create({
        type: "Product Added",
        message: `The product ${product.name} is added by the seller ${userInfo.name}`,
        recipientId: user.id,
      });
      const savedNotification = await notification.save();
      io.to(`user-${savedNotification.recipientId}`).emit(
        "productAdded",
        savedNotification.dataValues
      );

      const obj = {
        name: user.name,
        email: user.email,
        type: savedNotification.type,
        message: savedNotification.message,
        images: product.images,
      };
      await new SendEmail(obj, null, null).productAdded();
    });
    await new SendEmail(userObj, null, null).productAdded();
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("productRemoved", async (data) => {
  try {
    const { seller, product } = data;
    // The notification intended for the owner the product
    const ownerNotification = await Notification.create({
      type: "Product Removed",
      message: `You removed the product ${product.name} to the platform`,
      recipientId: seller.id,
    });
    const savedOwnerNotification = await ownerNotification.save();
    const userObj = {
      name: seller.name,
      email: seller.email,
      type: savedOwnerNotification.type,
      message: savedOwnerNotification.message,
      images: product.images,
    };
    io.to(`user-${savedOwnerNotification.recipientId}`).emit(
      "productRemoved",
      savedOwnerNotification.dataValues
    );

    const recipients = await User.findAll({
      where: {
        role: {
          [Op.or]: ["admin", "buyer"],
        },
      },
      attributes: ["id", "name", "email"],
    });
    recipients.forEach(async (user) => {
      const notification = await Notification.create({
        type: "Product Removed",
        message: `The product ${product.name} of the seller ${seller.name} is removed from the platform`,
        recipientId: user.id,
      });
      const savedNotification = await notification.save();
      io.to(`user-${savedNotification.recipientId}`).emit(
        "productRemoved",
        savedNotification.dataValues
      );

      const obj = {
        name: user.name,
        email: user.email,
        type: savedNotification.type,
        message: savedNotification.message,
        images: product.images,
      };
      await new SendEmail(obj, null, null).productRemoved();
    });
    await new SendEmail(userObj, null, null).productRemoved();
  } catch (error) {
    console.log(error);
  }
});

prodEmitter.on("productBought", async (data) => {
  try {
    const { buyerInfo, products } = data;

    let productNamesAndOwners = "";
    // eslint-disable-next-line prefer-const
    let productsImages = [];

    await Promise.all(
      products.map(async (product) => {
        const boughtProduct = await Product.findOne({
          where: { id: product.id },
          attributes: ["sellerId"],
          include: [
            {
              model: User,
              as: "seller",
            },
          ],
        });
        const { id, name, email } = boughtProduct.seller;
        productNamesAndOwners += `${product.quantity} item(s) of product ${product.name} from the seller ${name}, `;
        productsImages.push(product.image);
        const sellerNotif = await Notification.create({
          type: "Product Bought",
          message: `${product.quantity} item(s) of your product ${product.name} has been bought by ${buyerInfo.name}, you can check and approve the sale`,
          recipientId: id,
        });
        const savedSellerNotification = await sellerNotif.save();
        io.to(`user-${savedSellerNotification.recipientId}`).emit(
          "productBought",
          savedSellerNotification.dataValues
        );
        const sellerObj = {
          name,
          email,
          type: savedSellerNotification.type,
          message: savedSellerNotification.message,
          images: [product.image],
        };
        await new SendEmail(sellerObj, null, null).productBought();
      })
    );

    const buyerNotif = await Notification.create({
      type: "Product Bought",
      message: `You have bought ${products.length} products(s), ${productNamesAndOwners}`,
      recipientId: buyerInfo.id,
    });
    const savedBuyerNotification = await buyerNotif.save();
    io.to(`user-${savedBuyerNotification.recipientId}`).emit(
      "productBought",
      savedBuyerNotification.dataValues
    );
    const obj = {
      name: buyerInfo.name,
      email: buyerInfo.email,
      type: savedBuyerNotification.type,
      message: savedBuyerNotification.message,
      images: productsImages,
    };
    await new SendEmail(obj, null, null).productBought();
  } catch (error) {
    console.log(error);
  }
});

// prodEmitter.on("orderAccepted", async (data) => {
//   try{
// io.to(`user-${savedNotification.recipientId}`).emit(
//   "orderAccepted",
//   savedNotification.dataValues
// );
// await new SendEmail(obj, null, null).orderAccepted();
//   }catch(error){
//     console.log(error);
//   }
// })

// prodEmitter.on("orderDenied", async (data) => {
//   try{
// io.to(`user-${savedNotification.recipientId}`).emit(
//   "orderDenied",
//   savedNotification.dataValues
// );
// await new SendEmail(obj, null, null).orderDenied();
//   }catch(error){
//     console.log(error);
//   }
// })
