/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const cartLogger = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} added item ${req.params.id} to cart successfully`,
    userId: req.user.id,
    metadata: { addItemRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} added item ${req.params.id} to cart successfully`);
};
export const deleteItem = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} deleted item from cart successfully`,
    userId: req.user.id,
    metadata: { deleteItemRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} deleted item from cart successfully`);
};
export const ItemError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { ItemRequest: req.body },
  };
  await Log.create(logData);
  logger.error(`User ${req.user.email} encountered an errorwhile deleting item from cart:${error.message}`);
};

export const viewCart = async (req, cart) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} viewed cart ${cart} successfully`,
    userId: req.user.id,
    metadata: { viewCartRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} viewed cart successfully`);
};
export const clearCarts = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} cleared all items from cart successfully`,
    userId: req.user.id,
    metadata: { clearCartRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} cleared all items from cart successfully`);
};
export const viewAllCarts = async (req, cart) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} viewed all carts successfully`,
    userId: req.user.id,
    metadata: { viewCartRequest: cart },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} viewed all carts successfully`);
};
