import express from 'express';
import TransactionController from '../controllers/TransactionController';
import { isAdmin } from '../middlewares/authentication';
import multerUpload from '../middlewares/multerUpload';

/**
 * Routes of '/transactions'
 */
const transactionRouter = express.Router();

export default transactionRouter;
