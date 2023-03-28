/* eslint-disable no-console */
import Emitter from "../eventEmitter/user";
import { userEventEmitter } from "../../services/userService";
import "dotenv/config";
import SendEmail from "../../utils/email";
import { User, Notification } from "../../database/models";
import { io } from "../../utils/socketio";

const emitter = new Emitter();
emitter.on("passwordExpired", async (userObj) => {
  try {
    const notification = await Notification.create({
      type: "Password Expired",
      message: `Your password is exppired, update it to have full access`,
      recipientId: userObj.id,
    });
    const savedNotification = await notification.save();
    io.to(`user-${savedNotification.recipientId}`).emit(
      "productExpired",
      savedNotification.dataValues
    );
    await new SendEmail(
      userObj,
      process.env.HOME_PAGE_URL,
      null
    ).expiredPassword();
  } catch (error) {
    console.log(error);
  }
});
emitter.isPasswordExpired();

userEventEmitter.on("sendWelcome", async (data) => {
  try {
    const { name, email, token } = data;
    const url = `${process.env.UI_URL}/users/verify-email/${token}`;
    await new SendEmail({ name, email }, url, null).sendWelcome();
  } catch (error) {
    console.log(error);
  }
});

userEventEmitter.on("passwordUpdated", async (data) => {
  try {
    await new SendEmail(
      data,
      process.env.HOME_PAGE_URL,
      null
    ).passwordUpdated();
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
  }
});

userEventEmitter.on("passwordReset", async (data) => {
  try {
    const user = await User.findOne({ where: { email: data } });
    await new SendEmail(
      user,
      process.env.HOME_PAGE_URL,
      null
    ).successPassReset();
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
  }
});

userEventEmitter.on("sendGooglePassword", async (data) => {
  try {
    const { userObj, password } = data;
    await new SendEmail(userObj, null, password).sendGooglePassword();
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
  }
});

userEventEmitter.on("resetRequest", async (data) => {
  try {
    const { olduser, token } = data;
    await new SendEmail(
      olduser,
      `${process.env.UI_URL}/users/password-reset/${token}`,
      null
    ).reset();
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
  }
});

userEventEmitter.on("disableAccount", async (data) => {
  try {
    const { user } = data;
    await new SendEmail(user, null, null).deactivate();
  } catch (error) {
    console.log(error);
  }
});

userEventEmitter.on("activateAccount", async (data) => {
  /* istanbul ignore next */
  try {
    const { user } = data;
    await new SendEmail(user, null, null).activate();
  } catch (error) {
    console.log(error);
  }
});

userEventEmitter.on("twoFactorAuth", async (data) => {
  try {
    const { userInfo, randomAuth } = data;
    await new SendEmail(userInfo, null, randomAuth).twoFactorAuth();
  } catch (error) {
    console.log(error);
  }
});
