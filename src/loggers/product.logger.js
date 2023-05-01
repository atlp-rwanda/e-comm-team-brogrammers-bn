/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const createProduct = async (req, value) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} created product ${value.id}`,
    userId: req.user.id,
    metadata: { createdProduct: value },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} created product ${value.id}`);
};

export const updateProduct = async (req, res, value) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} updated product ${value.id}`,
    userId: req.user.id,
    metadata: { updatedProduct: value },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} updated product ${value.id}`);
};

export const deleteProducts = async (req, res, value) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} deleted product ${req.params.id}`,
    userId: req.user.id,
    metadata: { deletedProduct: value },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} deleted product ${req.params.id}`);
};

export const productError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
  logger.error(error);
};
export const viewProductReview = async () => {
  logger.info('User  viewed  a product reviews',);
};
export const retrieveAllProduct = async () => {
  logger.info('User retrieved all products');
};
export const retrieveOneProduct = async (req) => {
  logger.info(`User retrieved a product ${req.params.id}`);
};
export const sellerProduct = async (req, res, product) => {
  const logData = {
    level: 'info',
    message: `Seller ${req.user.email} retrieved all products`,
    userId: req.user.id,
    metadata: { AllProduct: product },
  };
  await Log.create(logData);
  logger.info(`Seller ${req.user.email} retrieved all products`);
};
export const toggleAvailablePro = async (req, res, product) => {
  const logData = {
    level: 'info',
    message: `Seller ${req.user.email} Updated availability of a product`,
    userId: req.user.id,
    metadata: { AllProduct: product },
  };
  await Log.create(logData);
  logger.info(`Seller ${req.user.email} Updated availability of a product`);
};
export const searchPro = async (products) => {
  logger.info(`user searched for  products ${products}`);
};
