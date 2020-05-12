import express from 'express';
import AuthController from '../controllers/AuthController';
import trimInputs from '../middlewares/trimInputs';
import validateInputs from '../middlewares/validateInputs';
import { authenticated, isAdmin } from '../middlewares/authentication';
import {
  registerRules, loginRules, changePasswordRules, resetPasswordRules,
} from '../middlewares/validationRules';

/**
 * Routes of '/auth'
 */
const authRouter = express.Router();

authRouter.route('/signup').post(trimInputs, validateInputs(registerRules), AuthController.signup);
authRouter.route('/login').post(trimInputs, validateInputs(loginRules), AuthController.login);
authRouter.route('/reset').post(trimInputs, validateInputs(resetPasswordRules), AuthController.requestResetPassword);
authRouter.route('/reset').patch(trimInputs, validateInputs(changePasswordRules), AuthController.resetPassword);

export default authRouter;
