import express from 'express';
import isAuthenticated from '../middlewares/verifyToken';
import checkRole from '../middlewares/Checkrole';
import catchError from '../middlewares/catchError';
import { 
    subscribe, 
    confirmEmail, 
    sendNewsletter, 
    unsubscribe 
} from '../controllers/subcriber.controller';

const router = express.Router();

router.post('/subscribe', catchError(subscribe));
router.get('/confirm-email', catchError(confirmEmail));
router.post('/send-newsletter',isAuthenticated,checkRole(['admin']), catchError(sendNewsletter));
router.post('/unsubscribe', catchError(unsubscribe));

export default router;