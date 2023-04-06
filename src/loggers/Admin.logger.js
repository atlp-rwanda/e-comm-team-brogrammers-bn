/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const updateUser = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} updated user ${req.params.id}`,
    userId: req.user.id,
    metadata: { updatedUser: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} updated user ${req.params.id}`);
};
export const updateUserError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
};
export const deleteUser = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} deleted user ${req.params.id}`,
    userId: req.user.id,
    metadata: { deletedUser: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} deleted user ${req.params.id}`);
};
export const deleteSubscriberLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} deleted a subscriber ${req.params.id}`,
    userId: req.user.id,
    metadata: { deletedSubscriber: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} deleted a subscriber ${req.params.id}`);
};
export const getAllSubscribersLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} retrieved all subscribers of newsletter`,
    userId: req.user.id,
    metadata: { deletedSubscriber: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} retrieved all subscribers of newsletter`);
};
export const deleteUserError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
};
export const createUser = async (req, data) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} signed up a new user ${data.id}`,
    userId: req.user.id,
    metadata: { newUser: data }
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} signed up a new user ${data.id}`);
};
export const UserError = async (req, error) => {
  const logData = {
    level: 'error',
    message: error.message,
    userId: req.user.id,
    metadata: { error },
  };
  await Log.create(logData);
};
export const viewAllUsers = async (req, data) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} viewed all users`,
    userId: req.user.id,
    metadata: { data },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} viewed all users`);
};
