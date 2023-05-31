/* eslint-disable import/named */

import logger from '../configs/logger';
import { Log } from '../database/models';

export const logSignup = async (req) => {
  const { ...data } = req.body;
  logger.info(`New user signed up: ${data.email}`);
};

export const logSignupError = async (req, error) => {
  const { ...data } = req.body;
  const logData = {
    level: 'error',
    message: `Failed to sign up new user: ${error.message}`,
    userId: data.id,
    metadata: { signupRequest: data },
  };
  await Log.create(logData);
  logger.error(`Failed to sign up new user: ${error.message}`);
};

export const logLogin = async (email, user) => {
  const logData = {
    level: 'info',
    message: `User ${email} logged in`,
    userId: user.id,
    metadata: { loginRequest: email },
  };
  await Log.create(logData);
  logger.info(`User ${email} logged in`);
};

export const logLoginError = async (req, error) => {
  logger.error(`user ${req.body.email} Failed to login :${error.message}`);
};

export const logEmailSent = async (email) => {
  logger.info(`Verification email sent to: ${email}`);
};
export const logVerifyEmail = async (email) => {
  logger.info(`User ${email} verified email`);
};
export const logLogout = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} logged out`,
    userId: req.user.id,
    metadata: { logoutRequest: {} },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} logged out`);
};
export const logLogoutError = async (req, error) => {
  const logData = {
    level: 'info',
    message: error.message,
    userId: req.user.id,
    metadata: { logoutRequest: {} },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} failed to logged out:${error.message}`);
};
export const logSetRole = async (req, role) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} set a new role ${role} to ${req.params.email}`,
    userId: req.user.id,
    metadata: { Request: role },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} set a new role ${role} to ${req.params.email}`);
};
export const logError = async (req, error) => {
  logger.info(`User ${req.body.email} encountered an issue :${error.message}`);
};
export const viewProfile = async (req, profile) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} viewed his  profile`,
    userId: req.user.id,
    metadata: { profile },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} viewed his  profile`);
};
export const editProfiles = async (req, profile) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} edited his  profile`,
    userId: req.user.id,
    metadata: { profile },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} edited his  profile`);
};
export const enableMfaLog = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} enabled mfa`,
    userId: req.user.id,
    metadata: { data: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} enabled mfa`);
};
export const disableMfaLog = async (req) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} disabled mfa`,
    userId: req.user.id,
    metadata: { data: req.body },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} disabled mfa`);
};
export const verifiedMfaLog = async (req, token) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} verified mfa code`,
    userId: req.user.id,
    metadata: { data: token },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} verified mfa code`);
};
export const createAdminLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} created an admin ${user.email}`,
    userId: req.user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email}created an admin ${user.email}`);
};
export const PasswordLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} received password reset link`,
    userId: req.user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} received password reset link`);
};
export const verifyPasswordLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${user.email} Password reset successful`,
    userId: user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
  logger.info(`User ${user.email} Password reset successful`);
};

export const changePasswordLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} changed password successful`,
    userId: req.user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} changed password successful`);
};
export const disableAccountLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} disabled account ${req.params.userId} successful`,
    userId: req.user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
  logger.info(`User ${req.user.email} disabled account ${req.params.userId} successful`);
};
export const redirectGoogle = async (email) => {
  logger.info(`User ${email} redirected to Google`);
};
export const redirectGoogleError = async (error) => {
  logger.error(`User not redirected to Google due to ${error} `);
};
export const resetPasswordLog = async (req) => {
  logger.error(`User ${req.body.email} resetted password `);
};
export const updateAvatarLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} updated his account avatar successful`,
    userId: req.user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
};
export const updateImageLog = async (req, user) => {
  const logData = {
    level: 'info',
    message: `User ${req.user.email} updated his account cover image successfully`,
    userId: req.user.id,
    metadata: { data: user },
  };
  await Log.create(logData);
};
