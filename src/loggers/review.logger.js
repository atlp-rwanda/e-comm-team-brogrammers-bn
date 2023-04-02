/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const logNewReview = async (req, data) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} created a new review`,
    userId: req.user.id,
    metadata: { review: data },
  };
  await Log.create(logData);
  logger.info(logData.message);
};
export const viewReview = async () => {
  logger.info('User  viewed all  reviews',);
};
export const viewOneReview = async () => {
  logger.info('User  viewed a single review',);
};
export const logDeletedReview = async (req, data) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} deleted review ${req.params.id}`,
    userId: req.user.id,
    metadata: { deleteReview: data },
  };
  await Log.create(logData);
  logger.info(logData.message);
};

export const logUpdatedReview = async (req, data) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} updated review ${req.params.id}`,
    userId: req.user.id,
    metadata: { updatedWishlist: data },
  };
  await Log.create(logData);
  logger.info(logData.message);
};

export const logReviewError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
  logger.error(logData.message);
};
