import express from 'express';
import { subscribe, confirmEmail, sendNewsletter, unsubscribe } from '../controllers/subcriber.controller';
import isAuthenticated from '../middlewares/verifyToken';
import checkRole from '../middlewares/Checkrole';


const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/confirm-email', confirmEmail);
router.post('/send-newsletter', isAuthenticated,checkRole(['admin']), sendNewsletter);
router.post('/unsubscribe', unsubscribe);

module.exports = router;