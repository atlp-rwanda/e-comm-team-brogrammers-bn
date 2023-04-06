/* eslint-disable import/no-import-module-exports */
import express from 'express';
import { getLogById, getUserLogs } from '../controllers/logs.controller';
import isAuthenticated from '../middlewares/verifyToken';

const logsroutes = express.Router();

logsroutes.get('/all', isAuthenticated, getUserLogs);
logsroutes.get('/:id', isAuthenticated, getLogById);

module.exports = logsroutes;
