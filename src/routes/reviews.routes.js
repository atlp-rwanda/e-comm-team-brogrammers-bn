import { Router } from 'express';

// eslint-disable-next-line import/named
import catchError from '../middlewares/catchError';
import requestValidator from '../middlewares/requestValidator';
import isAuthenticated from '../middlewares/verifyToken';
import {
  createReviewValidate,
  updateReviewValidate,
} from '../validations/review.validation';
import {
  createReview,
  deleteReview,
  getReview,
  listReviews,
  updateReview,
} from '../controllers/reviews.contollers';

const router = Router();

router.get('/', catchError(listReviews));
router.post(
  '/',
  isAuthenticated,
  requestValidator(createReviewValidate),
  catchError(createReview)
);
router.patch(
  '/:id',
  isAuthenticated,
  requestValidator(updateReviewValidate),
  catchError(updateReview)
);
router.get('/:id', catchError(getReview));
router.delete('/:id', isAuthenticated, catchError(deleteReview));

export default router;
