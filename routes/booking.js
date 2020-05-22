import express from 'express';
import trimInputs from '../middlewares/trimInputs';
import validateInputs from '../middlewares/validateInputs';
import {bookingRules} from '../middlewares/validationRules';
import BookingController from '../controllers/BookingController';


/**
 * Routes of '/auth'
 */
const bookingRouter = express.Router();

bookingRouter.route('/').get(BookingController.getAll);
bookingRouter.route('/view/:id').get(BookingController.viewOne);
bookingRouter.route('/create').post(trimInputs, validateInputs(bookingRules), BookingController.bookAservice);
bookingRouter.route('/update').patch(trimInputs, validateInputs(bookingRules), BookingController.updateBooking);
bookingRouter.route('/delete/:id').delete(BookingController.updateBooking);

export default bookingRouter;
