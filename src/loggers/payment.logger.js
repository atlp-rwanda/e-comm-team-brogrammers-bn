/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const logPaymentSuccess = async (user, products) => {
  const logData = {
    level: 'info',
    message: `User ${user.email} completed a payment`,
    userId: user.id,
    metadata: { products },
  };
  await Log.create(logData);
  logger.info(`User ${user.email} completed a payment`);
};

export const logPaymentFail = async (req) => {
  const logData = {
    level: 'info',
    message: `Payment failed for user ${req.user.email}`,
    userId: req.user.id,
    metadata: { redirect: { } },
  };
  await Log.create(logData);
  logger.info(`Payment failed for user ${req.user.email}`);
};

export const logPaymentError = async (req, error) => {
  const logData = {
    level: 'error',
    message: `Error processing payment for user ${req.user.email}: ${error.message}`,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
  logger.error(`Error processing payment for user ${req.user.email}: ${error.message}`);
};
