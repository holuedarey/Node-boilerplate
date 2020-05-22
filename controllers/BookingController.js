/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import { curDate, validateMongoID } from '../helpers/utils';
import Logger from '../helpers/Logger';
import BookingServices from '../database/services/BookingServices';
import { sendNotification } from '../socket/admin';
import Services from '../database/mongodb/models/Service';
import Booking from '../database/mongodb/models/Service';

class BookingController {


  /**
  * This handles getting transaction history.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */async viewOne(req, res) {
    const { id } = req.params;

    if (!validateMongoID(id)) {
      return Response.send(res, codes.badRequest, {
        error: 'Record not found.',
      });
    }

    try {
      const booking = await Booking.findById({_id:id});

      if (!booking) {
        return Response.send(res, codes.notFound, {
          error: 'Booking not found.',
        });
      }

      return Response.send(res, codes.success, {
        data: booking,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles getting transaction history.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async getAll(req, res) {

    let {
      page, limit,
    } = req.query;

    limit = Number.isNaN(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
    page = Number.isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);

    try {
      const booking = new BookingServices();
      const result = await booking.getAll(page, limit);
      Response.send(res, codes.success, {
        data: result,
      });
    } catch (error) { Response.handleError(res, error); }
  }


  /**
* This handles getting transaction history.
* @param {express.Request} req Express request param
* @param {express.Response} res Express response param
*/
  async bookAservice(req, res) {
    const {
      service_date, service_time, title, description, service, category,
    } = req.body;

    const { user } = req;
    const data = {
      service_date,
      service_time,
      title,
      description,
      service,
      category,
      user_id: user._id,
      firstname: user.firstname,
      lastname: user.lastname
    };

    const newServices = new BookingServices();
    try {
      const bookServices = await newServices.bookAservices(data);
      //start socket to send notification
      // setTimeout(() => {
      sendNotification('customer', bookServices._id)
      // }, 1000)

      Response.send(res, codes.success, {
        data: bookServices,
      });
    } catch (error) { Response.handleError(res, error); }
  }


  /**
* This handles getting transaction history.
* @param {express.Request} req Express request param
* @param {express.Response} res Express response param
*/
  async updateBooking(req, res) {
    const {
      service_date, service_time, title, description, service, category, id: _id
    } = req.body;

    if (!validateMongoID(_id)) {
      return Response.send(res, codes.badRequest, {
        error: 'Record not found.',
      });
    }
    const { user } = req;
    console.log(user);
    const data = {
      service_date,
      service_time,
      title,
      description,
      service,
      category,
      user_id: user._id,
      firstname: user.firstname,
      lastname: user.lastname
    };

    try {
      const service = await Booking.findOne({ _id });
      if (!service) {
        return Response.send(res, codes.badRequest, {
          error: 'Record not found.',
        });
      }
      const updateBookServices = service(data);
      updateBookServices.save();

      //start socket to send notification
      // setTimeout(() => {
      sendNotification('customer_update', bookServices._id)
      // }, 1000)

      Response.send(res, codes.success, {
        data: updateBookServices,
      });
    } catch (error) { Response.handleError(res, error); }
  }


  /**
* This handles getting transaction history.
* @param {express.Request} req Express request param
* @param {express.Response} res Express response param
*/

  async deleteBooking(req, res) {
    if (!validateMongoID(req.params.id)) {
      return Response.send(res, codes.badRequest, {
        error: 'Record not found.',
      });
    }
    try {
      await Booking.deleteOne({ _id: req.params.id });
      return Response.send(res, codes.success, {
        data: {
          message: 'Record deleted successfully.',
        },
      });
    } catch (error) { return Response.handleError(res, error); }
  }

}

export default new BookingController();
