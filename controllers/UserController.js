// eslint-disable-next-line no-unused-vars
import express from 'express';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import User, { getUserPosVal, userRoles } from '../database/mongodb/models/User';
import { validateMongoID } from '../helpers/utils';

class UserController {
  /**
  * This handles viewing all users.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async getUsers(req, res) {
    let { page, limit } = req.query;

    limit = Number.isNaN(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
    page = Number.isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);

    const offset = (page - 1) * limit;
    try {
      const users = await User.find({}).select('-password -emailtoken').skip(offset).limit(limit)
        .lean();
      const data = users.map((item) => {
        const role = item.position || (item.roles.includes('super') ? 'super_admin' : '') || (item.roles.includes('admin') ? 'admin' : 'staff');
        item.role = userRoles[role] || 'Staff';
        delete item.roles;
        delete item.position;
        return item;
      });

      return Response.send(res, codes.success, {
        data,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles viewing a given user.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async getUser(req, res) {
    if (!validateMongoID(req.params.id)) {
      return Response.send(res, codes.badRequest, {
        error: 'User not found.',
      });
    }
    try {
      const user = await User.findById(req.params.id).lean();
      if (!user) {
        return Response.send(res, codes.notFound, {
          error: 'User not found.',
        });
      }
      delete user.password;
      delete user.emailtoken;
      return Response.send(res, codes.success, {
        data: user,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles setting merchants email.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async setMerchantEmail(req, res) {
    const { merchant_id, email } = req.body;
    try {
      const user = await Merchant.findOne({ merchant_id });
      if (!user) {
        return Response.send(res, codes.notFound, {
          error: 'User not found.',
        });
      }
      user.merchant_email = email;
      await user.save();
      return Response.send(res, codes.success, {
        data: { message: 'Email successfully set.' },
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles deleting a user.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async deleteUser(req, res) {
    if (!validateMongoID(req.params.id)) {
      return Response.send(res, codes.badRequest, {
        error: 'User not found.',
      });
    }
    try {
      await User.deleteOne({ _id: req.params.id });
      return Response.send(res, codes.success, {
        data: {
          message: 'User deleted successfully.',
        },
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  async setUserRole(req, res) {
    const { role, id: _id } = req.body;
    if (!validateMongoID(_id)) {
      return Response.send(res, codes.badRequest, {
        error: 'User not found.',
      });
    }
    let roles = `${role || ''}`.toLowerCase().split(' ') || [];
    let position = null;

    if (Object.keys(getUserPosVal('all')).includes(role)) {
      roles = ['admin'];
      position = role;
    }

    try {
      const user = await User.findOne({ _id });
      if (!user) {
        return Response.send(res, codes.badRequest, {
          error: 'User not found.',
        });
      }
      user.position = position;
      user.roles = roles;
      await user.save();
      return Response.send(res, codes.success, {
        data: {
          message: 'User role updated successfully.',
        },
      });
    } catch (error) { return Response.handleError(res, error); }
  }
}

export default new UserController();
