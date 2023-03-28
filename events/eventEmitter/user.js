/* eslint-disable require-jsdoc */
import EventEmitter from "events";
import schedule from "node-schedule";
import "dotenv/config";
import { User } from "../../database/models";

class Emitter extends EventEmitter {
  isPasswordExpired() {
    schedule.scheduleJob(process.env.SCHEDULE_TIME, async () => {
      const users = await User.findAll();
      users.forEach((user) => {
        const expirationTime = process.env.PASSWORD_EXPIRATION_TIME;
        const passwordUpdated = new Date(user.lastTimePasswordUpdated);
        const expirationDate = new Date(
          parseInt(passwordUpdated.getTime(), 10) + parseInt(expirationTime, 10)
        ).toLocaleDateString("en-US");
        const now = new Date().toLocaleDateString("en-US");
        if (expirationDate === now) {
          return this.emit("passwordExpired", {
            email: user.email,
            name: user.name,
            id: user.id,
          });
        }
      });
    });
  }
}

export default Emitter;
