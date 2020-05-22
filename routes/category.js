import express from 'express';
import trimInputs from '../middlewares/trimInputs';
import validateInputs from '../middlewares/validateInputs';
import { categoryRules} from '../middlewares/validationRules';
import CategoryController from '../controllers/CategoryController';


/**
 * Routes of '/auth'
 */
const categoryRouter = express.Router();

categoryRouter.route('/').get( CategoryController.allCategory);
categoryRouter.route('/create').post(trimInputs, validateInputs(categoryRules),  CategoryController.createCategory);
categoryRouter.route('/update').patch(trimInputs, validateInputs(categoryRules),  CategoryController.updateCategory);

export default categoryRouter;
