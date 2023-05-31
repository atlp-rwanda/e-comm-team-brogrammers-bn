/* eslint-disable require-jsdoc */
/* eslint-disable import/prefer-default-export */
import cron from 'node-cron';
import dotenv from 'dotenv';
import { emailConfig } from '../helpers/emailConfig';
import {
  verifyEmailSubscriberTemplate,
  thankYouSubscriberTemplate,
  newsletterTemplate,
} from '../helpers/mailTemplate';
import { sendEmail } from '../helpers/mail';
import Subscribers from '../services/subscriber.services';
import { deleteSubscriberLog, getAllSubscribersLog, UserError } from '../loggers/Admin.logger';
import { Jwt } from '../helpers/jwt';

dotenv.config();

const { CRON_SCHEDULE } = process.env;

export class SubscriberController {
  static async subscribe(req, res) {
    try {
      const { data } = await Subscribers.register(req.body);
      console.log({ redirect: req.headers.success });
      const redirect = await Jwt.generateToken({ redirect: req.headers.success });
      const SubscriberTemplate = verifyEmailSubscriberTemplate(data.verificationToken, redirect);
      sendEmail(
        emailConfig({
          email: data.email,
          subject: 'Brogrammers NewsLetter Signup',
          content: SubscriberTemplate,
        })
      );
      res.status(201).json(data);
    } catch (err) {
      UserError(req, err);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async verify(req, res) {
    try {
      const { token } = req.params;
      const { r } = req.query;
      const { value } = Jwt.verifyToken(r);
      const { redirect } = value;
      const subscribers = await Subscribers.findByVerificationToken(token);
      if (!subscribers) {
        return res.status(404).json({ error: 'Invalid verification token' });
      }
      if (subscribers.verified) {
        return res.status(400).json({ error: 'Subscriber already verified' });
      }
      await Subscribers.verifySubscriber(subscribers);
      const SubscriberTemplate = thankYouSubscriberTemplate(
        subscribers.firstName,
        subscribers.id
      );
      sendEmail(
        emailConfig({
          email: subscribers.email,
          subject: 'Brogrammers NewsLetter Signup',
          content: SubscriberTemplate,
        })
      );
      if (redirect) return res.status(301).redirect(redirect);
      return res.status(200).send({
        message: 'Email Subscribed successfully!',
        subscribed: true,
      });
    } catch (err) {
      UserError(req, err);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async unsubscribe(req, res) {
    try {
      const { id } = req.params;
      const subscriber = await Subscribers.findById(id);
      if (subscriber) {
        subscriber.subscribed = false;
        await subscriber.save();
        res.status(200).send({
          message: 'Unsubscribed successfully!',
          subscribed: false,
        });
      } else {
        res.status(404).json({ message: 'Subscriber not found' });
      }
    } catch (err) {
      UserError(req, err);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadNewsletter(res) {
    try {
      const subscribers = await Subscribers.getAllSubscribersTrue();
      const product = await Subscribers.getProducts();
      if (subscribers.length === 0) {
        res.status(404).json({
          message: 'There are no subscribers to send newsletter to',
        });
      }
      subscribers.forEach((subscriber) => {
        const newsletterHeader = 'New Products Alert!';
        const newsletterInfo = 'Here are some new products we want to share with you.';
        const newsletterContent = newsletterTemplate(
          subscriber.firstName,
          product[0].dataValues,
          subscriber.id,
          newsletterHeader,
          newsletterInfo
        );
        sendEmail(
          emailConfig({
            email: subscriber.email,
            subject: 'New Products Alert!',
            content: newsletterContent,
          })
        );
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static sendNewsletter(res) {
    cron.schedule(CRON_SCHEDULE, async () => {
      try {
        await SubscriberController.uploadNewsletter();
      } catch (err) {
        res.status(500).json({
          message: err.message,
        });
      }
    });
  }

  static async getAllSubscribers(req, res) {
    try {
      const { limit, page } = req.query;
      const subscribers = await Subscribers.getAllSubscribers(page, limit);
      if (subscribers.totalCount === 0) {
        res.status(200).json({
          message: 'There are no subscribers',
          subscribers
        });
      } else {
        getAllSubscribersLog(req, subscribers);
        res.status(200).json({
          message: 'All subscribers Retrieved Successfully',
          subscribers
        });
      }
    } catch (err) {
      UserError(req, err);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async deleteSubscriber(req, res) {
    try {
      const { id } = req.params;
      const subscriber = await Subscribers.findById(id);
      if (subscriber) {
        await subscriber.destroy();
        deleteSubscriberLog(req, subscriber);
        res
          .status(200)
          .json({ message: 'Subscriber deleted successfully', subscriber });
      } else {
        res.status(404).json({ message: 'Subscriber not found' });
      }
    } catch (err) {
      UserError(req, err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}
