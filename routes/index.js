
import codes from '../helpers/statusCodes';
import Response from '../helpers/Response';
import transactionRouter from './transactions';
import authRouter from './auth';
import { authenticated, isAuthPTSP } from '../middlewares/authentication';
import FileController from '../controllers/FileController';
import usersRouter from './users';


/**
 * Router
 */
const route = (app) => {
  app.use('/api/v1/transactions', authenticated, transactionRouter);
  app.use('/api/v1/users', authenticated, usersRouter);
  app.use('/api/v1/auth', authRouter);
  
  //endpoint to get data from vas transaction

  app.get('/api/v1/files/*', FileController.download);
  app.get('/', (req, res) => Response.send(res, codes.success, {
    message: 'This app is running!!!',
  }));
  app.get('/api', (req, res) => Response.send(res, codes.success, {
    message: 'This app is running!!!',
  }));
  app.get('/api/v1', (req, res) => Response.send(res, codes.success, {
    message: 'This is version 1.0.1!',
  }));


  app.get('*', (req, res) => Response.send(res, codes.notFound, {
    error: 'Endpoint not found.',
  }));
};

export default route;
