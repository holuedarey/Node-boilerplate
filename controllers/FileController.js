// eslint-disable-next-line no-unused-vars
import express from 'express';
import fs from 'fs';
import path from 'path';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';

/**
* File Controller
*/
class FileController {
  /**
  * This handles returning uploaded files.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  download(req, res) {
    const filePath = `files${req.path.split('/files')[1]}`;

    if (fs.existsSync(filePath)) return res.sendFile(path.resolve(filePath));

    return Response.send(res, codes.notFound, {
      error: 'File not found',
    });
  }
}

export default new FileController();
