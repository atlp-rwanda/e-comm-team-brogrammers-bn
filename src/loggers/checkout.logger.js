/* eslint-disable import/named */
import logger from '../configs/logger';
import { Log } from '../database/models';

export const createOrders = async (req, products) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} created an order successfully`,
    userId: req.user.id,
    metadata: { products },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} created an order successfully`);
};

export const OrderError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
  logger.error(`User ${req.user.email} encountered an error while creating an order: ${error.message}`);
};

export const viewOrders = async (req, order) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} viewed an order${order.id} successfully`,
    userId: req.user.id,
    metadata: { viewOrderRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} viewed an order successfully`);
};
export const viewOrderss = async (req, order) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} viewed  all his orders successfully`,
    userId: req.user.id,
    metadata: { viewOrderRequest: order },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} viewed  all his orders successfully`);
};
export const updatedOrders = async (req, order) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} updated an order${order.id} successfully`,
    userId: req.user.id,
    metadata: { cancelOrderRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} updated an order${order.id} successfully`);
};
export const deletedOrders = async (req, order) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} deleted an order${order.id} successfully`,
    userId: req.user.id,
    metadata: { cancelOrderRequest: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} deleted an order${order.id} successfully`);
};
export const adminGetOrders = async (req, order) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} get all  orders successfully`,
    userId: req.user.id,
    metadata: { AllOrderRequest: order },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} get all  orders successfully`);
};
