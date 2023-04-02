/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const ItemError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { ItemRequest: req.body },
  };
  await Log.create(logData);
  logger.error(`seller ${req.user.email} encountered an error:${error.message}`);
};

export const viewAllStats = async (req) => {
  const logData = {
    level: 'info',
    message: `seller ${req.user.email} viewed his products statistics`,
    userId: req.user.id,
    metadata: { },
  };
  await Log.create(logData);
  logger.info(`seller ${req.user.email} viewed his products statistics`);
};
export const viewAllStatsGraph = async (req) => {
  const logData = {
    level: 'info',
    message: `seller ${req.user.email} viewed his products statistics graph`,
    userId: req.user.id,
    metadata: { },
  };
  await Log.create(logData);
  logger.info(`seller ${req.user.email} viewed his products statistics graph`);
};
