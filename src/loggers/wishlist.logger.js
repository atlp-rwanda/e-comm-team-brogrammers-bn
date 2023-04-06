/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const createWishlist = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} added a product ${req.params.id} in wishlist`,
    userId: req.user.id,
    metadata: { wishlist: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} added a product ${req.params.id} in wishlist`);
};

export const deleteWishlists = async (req, res, wishlist) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} removed a product ${req.params.id} in wishlist`,
    userId: req.user.id,
    metadata: { deletedWishlist: wishlist },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} removed a product ${req.params.id} in wishlist`);
};
export const wishlistError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
  logger.error(error);
};
export const getWishlists = async (req, Products) => {
  const logData = {
    level: 'info',
    message: `${req.user.email} viewed products in wishlist`,
    userId: req.user.id,
    metadata: { wishlistProducts: Products },
  };
  await Log.create(logData);
  logger.info(`${req.user.email}  viewed products in wishlist`, { wishlistProducts: Products });
};
export const AdmingetWishlists = async (req, userwishes) => {
  const logData = {
    level: 'info',
    message: 'All wishlists retrieved',
    userId: req.user.id,
    metadata: { userWishlists: userwishes },
  };
  await Log.create(logData);
  logger.info('All wishlists retrieved', { userWishlists: userwishes });
};
export const clearWishlists = async (req, userwishes) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} cleared all wishlists`,
    userId: req.user.id,
    metadata: { userwishes },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} cleared all wishlists`);
};
