// routes/contactRoutes.js

// eslint-disable-next-line import/no-import-module-exports
import express from 'express';
import {
  createContact,
  getAllContacts,
} from '../controllers/contactController';

const router = express.Router();
// const contactController = require('../controllers/contactController');

router.post('/', createContact);
router.get('/', getAllContacts);

export default router;
