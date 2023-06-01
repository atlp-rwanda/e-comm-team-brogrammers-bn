/* eslint-disable import/named */
// eslint-disable-next-line import/named
import dotenv from 'dotenv';
import {
  // eslint-disable-next-line import/named
  reviews,
  products,
  users,
  notifications,
} from '../database/models';
import { sendEmail } from '../helpers/mail';
import { emailConfig } from '../helpers/emailConfig';
// eslint-disable-next-line import/named
import { notificationTemplate } from '../helpers/mailTemplate';
import paginatedResults from '../middlewares/paginating';
import {
  logNewReview,
  logDeletedReview,
  logReviewError,
  logUpdatedReview,
  viewReview,
  viewOneReview,
} from '../loggers/review.logger';

dotenv.config();

export const listReviews = async (req, res) => {
  paginatedResults(reviews)(req, res, () => res.status(200).json(res.paginatedResults));
  viewReview();
};

export const createReview = async (req, res) => {
  const userId = req.user.id;
  const product = await products.findOne({ where: { id: req.body.productId } });
  if (product && product.sellerId === userId) {
    return res.status(403).json({ message: "You can't review yourself" });
  }
  const seller = await users.findOne({ where: { id: product.sellerId } });
  const review = await reviews.create({ userId, ...req.body });
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
  logNewReview(req, review);
  const productReviews = await reviews.findAll({
    where: { productId: req.body.productId },
    include: {
      model: users,
      as: 'reviewer',
      attributes: ['username', 'email', 'avatar'],
    },
  });
  const AvRate = productReviews.reduce((sum, Review) => sum + Review.rating, 0)
    / productReviews.length;
  const ratingCounts = productReviews.reduce((counts, Review) => {
    const { rating } = Review;
    counts[rating] = (counts[rating] || 0) + 1;
    return counts;
  }, {});
  const totalRates = {
    1: ratingCounts[1] || 0,
    2: ratingCounts[2] || 0,
    3: ratingCounts[3] || 0,
    4: ratingCounts[4] || 0,
    5: ratingCounts[5] || 0,
    AvRate,
  };
  console.log(totalRates);

  res.status(201).json({
    ...review.dataValues,
    reviewer: {
      username: seller.username,
      email: seller.email,
      avatar: seller.avatar,
    },
    totalRates,
  });
};

export const getReview = async (req, res) => {
  try {
    const review = await reviews.findOne({
      where: { id: req.params.id },
    });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    viewOneReview();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
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
    logUpdatedReview(req, newReview);
    const productReviews = await reviews.findAll({
      where: { productId: newReview.productId },
      include: {
        model: users,
        as: 'reviewer',
        attributes: ['username', 'email', 'avatar'],
      },
    });
    const AvRate = productReviews.reduce((sum, Review) => sum + Review.rating, 0)
      / productReviews.length;
    const ratingCounts = productReviews.reduce((counts, Review) => {
      const { rating } = Review;
      counts[rating] = (counts[rating] || 0) + 1;
      return counts;
    }, {});
    const totalRates = {
      1: ratingCounts[1] || 0,
      2: ratingCounts[2] || 0,
      3: ratingCounts[3] || 0,
      4: ratingCounts[4] || 0,
      5: ratingCounts[5] || 0,
      AvRate,
    };
    console.log(totalRates);
    res.status(200).json({
      ...newReview.dataValues,
      reviewer: {
        username: seller.username,
        email: seller.email,
        avatar: seller.avatar,
      },
      totalRates,
    });
  } catch (error) {
    logReviewError(req, error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
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
    if (count === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    logDeletedReview(req, review);

    const productReviews = await reviews.findAll({
      where: { productId: product.id },
    });
    console.log(productReviews);
    const AvRate = productReviews.reduce((sum, Review) => sum + Review.rating, 0)
      / productReviews.length;
    const ratingCounts = productReviews.reduce((counts, Review) => {
      const { rating } = Review;
      counts[rating] = (counts[rating] || 0) + 1;
      return counts;
    }, {});
    const totalRates = {
      1: ratingCounts[1] || 0,
      2: ratingCounts[2] || 0,
      3: ratingCounts[3] || 0,
      4: ratingCounts[4] || 0,
      5: ratingCounts[5] || 0,
      AvRate,
    };
    res.status(200).json({ review, totalRates });
  } catch (error) {
    logReviewError(req, error);
    res.status(500).json({ message: error.message });
  }
};
