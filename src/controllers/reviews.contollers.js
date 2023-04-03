// eslint-disable-next-line import/named
import {
  // eslint-disable-next-line import/named
  reviews, products, users, notifications
} from '../database/models';
import { sendEmail } from '../helpers/mail';
import { emailConfig } from '../helpers/emailConfig';
// eslint-disable-next-line import/named
import { notificationTemplate } from '../helpers/mailTemplate';
import dotenv from 'dotenv';
dotenv.config();

export const listReviews = async (req, res) => {
  res.json(await reviews.findAll());
};

export const createReview = async (req, res) => {
  const userId = req.user.id;
  const product = await products.findOne({ where: { id: req.body.productId } });
  const review = await reviews.create({ userId, ...req.body });
  if (product && product.sellerId === userId) {
    return res.status(403).json({ message: "You can't review yourself" });
  }
  const seller = await users.findOne({ where: { id: product.sellerId } });
  const newNotification = {
    message: 'your product have been reviewed',
    type: 'product review',
  };
  const newN = { ...newNotification };
  newN.receiverId = product.sellerId;
  const receiver = {
    username: seller.username,
    email: seller.email,
  };
  const notifyEmail = notificationTemplate(
    receiver.username,
    newN.message,
    newN.type,
    `${process.env.SWAGGER_SERVER}/reviews/${review.id}`
  );
  sendEmail(
    emailConfig({
      email: receiver.email,
      subject: 'Notification !! review',
      content: notifyEmail,
    })
  );
  await notifications.create(newN);

  res.status(201).json(review);
};

export const getReview = async (req, res) => {
  // if (isNaN(req.params.id))
  const review = await reviews.findOne({
    where: { id: req.params.id },
  });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json(review);
};

export const updateReview = async (req, res) => {
  const review = await reviews.findOne({
    where: { id: req.params.id },
  });
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (req.user.id !== review.userId) {
    return res
      .status(403)
      .json({ message: 'Only owner can update this review' });
  }
  const product = await products.findOne({ where: { id: review.productId } });
  const seller = await users.findOne({ where: { id: product.sellerId } });
  const newNotification = {
    message: 'the review on your product have been deleted',
    type: 'product review',
  };
  const newN = { ...newNotification };
  newN.receiverId = product.sellerId;
  const receiver = {
    username: seller.username,
    email: seller.email,
  };
  const notifyEmail = notificationTemplate(
    receiver.username,
    newN.message,
    newN.type,
    `${process.env.SWAGGER_SERVER}/reviews/${review.id}`
  );
  sendEmail(
    emailConfig({
      email: receiver.email,
      subject: 'Notification !! review',
      content: notifyEmail,
    })
  );
  await notifications.create(newN);

  await reviews.update({ ...req.body }, { where: { id: review.id } });

  const newReview = await reviews.findOne({ where: { id: review.id } });
  res.status(200).json(newReview);
};

export const deleteReview = async (req, res) => {
  const review = await reviews.findOne({
    where: { id: req.params.id },
  });
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (req.user.role !== 'admin' && req.user.id !== review.userId) {
    return res
      .status(403)
      .json({ message: 'Only owner or admin can delete this review' });
  }
  const product = await products.findOne({ where: { id: review.productId } });
  const seller = await users.findOne({ where: { id: product.sellerId } });
  const newNotification = {
    message: 'the review on your product have been updated',
    type: 'product review',
  };
  const newN = { ...newNotification };
  newN.receiverId = product.sellerId;
  const receiver = {
    username: seller.username,
    email: seller.email,
  };
  const notifyEmail = notificationTemplate(
    receiver.username,
    newN.message,
    newN.type,
    `${process.env.SWAGGER_SERVER}/reviews/${review.id}`
  );
  sendEmail(
    emailConfig({
      email: receiver.email,
      subject: 'Notification !! review',
      content: notifyEmail,
    })
  );
  await notifications.create(newN);

  const count = await reviews.destroy({ where: { id: review.id } });
  if (count === 0) return res.status(404).json({ message: 'Review not found' });

  res.status(200).json({ message: 'Review deleted' });
};
