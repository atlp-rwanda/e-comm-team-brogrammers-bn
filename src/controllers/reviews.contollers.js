// eslint-disable-next-line import/named
import { reviews, products } from '../database/models';

export const listReviews = async (req, res) => {
  res.json(await reviews.findAll());
};

export const createReview = async (req, res) => {
  const userId = req.user.id;
  const product = await products.findOne({ where: { id: req.body.productId } });
  if (product && product.sellerId === userId) {
    return res.status(403).json({ message: "You can't review yourself" });
  }
  const review = await reviews.create({ userId, ...req.body });
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

  await reviews.update({ ...req.body }, { where: { id: review.id } });

  const newReview = await reviews.findOne({ where: { id: review.id } });
  res.status(200).json(newReview);
};

export const deleteReview = async (req, res) => {
  const review = await reviews.findOne({
    where: { id: req.params.id },
  });
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (req.user.id !== review.userId || req.user.role === 'admin') {
    return res
      .status(403)
      .json({ message: 'Only owner or admin can delete this review' });
  }

  const count = await reviews.destroy({ where: { id: review.id } });
  if (count === 0) return res.status(404).json({ message: 'Review not found' });

  res.status(204).json({ message: 'Review deleted' });
};
