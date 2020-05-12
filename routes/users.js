import express from 'express';
import validateInputs2 from 'json-request-validator';
import UserController from '../controllers/UserController';
import { isAdmin } from '../middlewares/authentication';
import validateInputs from '../middlewares/validateInputs';
import { merchantEmailRules, setRoleRules } from '../middlewares/validationRules';

/**
 * Routes of '/users'
 */
const usersRouter = express.Router();

usersRouter.get('/', isAdmin('super'), UserController.getUsers);
usersRouter.patch('/', isAdmin('super'), validateInputs2(setRoleRules), UserController.setUserRole);
usersRouter.delete('/:id', isAdmin('super'), UserController.deleteUser);
usersRouter.post('/merchant', isAdmin('super'), validateInputs(merchantEmailRules), UserController.setMerchantEmail);

export default usersRouter;
