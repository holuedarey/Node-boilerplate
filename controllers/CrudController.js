/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
import express from 'express';
import TransactionService from '../database/services/CrudService';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import CrudService from '../database/services/CrudService';
import request from "request";


class CrudController {

  
  /**
  * This handles query the Ice And Fire API to get External Books.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
    ExternalBooks(req, res) {
    const { name } = req.query;
    const CrudModel = new CrudService();
        
    try {
      // const data =  request.get(`${process.env.API_URL}/books/${name ? name : ''}`, (error, response, body) => {
      //   // console.log('file : ',)
      //   return body;
      // });
      return  res.json (new Promise((resolve, reject) => {

        request.get(`${process.env.API_URL}/books/${name ? name : ''}`,  (err, response, body) => {

            if(err) reject(err);

            let loginResponse = body
            console.log("---Token---", loginResponse);
            resolve(loginResponse);

        })
      }));
      
      // console.log('data : ', data)
      Response.send(res, codes.success, {
        data: data
      });
    } catch (error) { Response.handleError(res, error); }
  }

}

export default new CrudController();
