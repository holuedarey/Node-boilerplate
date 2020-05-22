/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
import express from 'express';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import { curDate, validateMongoID } from '../helpers/utils';
import Logger from '../helpers/Logger';
import { ObjectID } from 'mongodb';
import CategoryService from '../database/services/CategoryServices';
import Category from '../database/mongodb/models/Category';

class CategoryController {

  /**
* This handles getting transaction history.
* @param {express.Request} req Express request param
* @param {express.Response} res Express response param
*/
  async createCategory(req, res) {
    const { title, description } = req.body;
    const data = {
      title,
      description,

    };

    const category = new CategoryService();
    try {
      const createCategory = await category.createCategory(data);

      Response.send(res, codes.success, {
        data: createCategory,
      });
    } catch (error) { Response.handleError(res, error); }
  }


  /**
* This handles getting transaction history.
* @param {express.Request} req Express request param
* @param {express.Response} res Express response param
*/
  async updateCategory(req, res) {
    const { title, description, id: _id } = req.body;
    const data = {
      title,
      description,

    };

    if (!validateMongoID(_id)) {
      return Response.send(res, codes.badRequest, {
        error: 'Record not found.',
      });
    }

    try {
      const category = await Category.findOne({ _id });
      if (!category) {
        return Response.send(res, codes.badRequest, {
          error: 'Record not found.',
        });
      }
      const updateCategory = category(data);
      updateCategory.save();
      Response.send(res, codes.success, {
        data: updateCategory,
      });
    } catch (error) { Response.handleError(res, error); }
  }

  /**
  * This handles getting transaction history.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async allCategory(req, res) {

    let {
      page, limit,
    } = req.query;

    limit = Number.isNaN(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
    page = Number.isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);

    try {
      const categories = new CategoryService();
      const result = await categories.allCategory(page, limit);

      Response.send(res, codes.success, {
        data: result,
      });
    } catch (error) { Response.handleError(res, error); }
  }
}

export default new CategoryController();
