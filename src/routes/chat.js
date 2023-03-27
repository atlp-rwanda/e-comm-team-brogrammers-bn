/* eslint-disable import/no-import-module-exports */
import express from 'express';
import { ChatController } from '../controllers/chat.controller';
import isAuthenticated from '../middlewares/verifyToken';

const routes = express.Router();

routes.post('/message', isAuthenticated, ChatController.addSingleMessage);
routes.get('/all', isAuthenticated, ChatController.getAllMessages);

module.exports = routes;
