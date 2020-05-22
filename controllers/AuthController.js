/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
import express from 'express';
import bcrypt from 'bcrypt';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import TokenUtil from '../helpers/TokenUtil';
import sendEmailSms from '../helpers/emailSender';
import User, { getUserPosVal } from '../database/mongodb/models/User';
import { getUserFromToken } from '../middlewares/authentication';
import { validateEmail } from '../helpers/utils';


/**
* Authentication Controller
*/
class AuthController {
  /**
  * This handles user registration.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async signup(req, res) {
    const {
      firstname, lastname, email, password: pass, role,
    } = req.body;

    let roles = `${role || ''}`.toLowerCase().split(' ') || [];
    let position = `${role || ''}`.toLowerCase().replace(/\s/g, '_');

    if (Object.keys(getUserPosVal('all')).includes(role)) {
      roles = ['admin'];
      position = role;
    }

    try {
      const password = bcrypt.hashSync(pass, 10);
      const user = new User({
        firstname,
        lastname,
        email,
        password,
        position,
        roles 
      });
      user.save();

      const message = `
      <div><img style="height: 35px; display: block; margin: auto" src="${process.env.UI_URL}/assets/img/trackmoney.png"/></div>
      <p>Hello <b>${user.firstname},</b><p>
      <p style="margin-bottom: 0">Your account on ${process.env.APP_NAME} has been created. You can login using your email and password.</p>
      <p style="margin-bottom: 0">Email: <code>${user.email}</code></p>
      <p style="margin-top: 0">Password: <code>${pass}</code></p>
      <p><small>You can change your password when you login.</small></p>
      <a href="${process.env.UI_URL}/login">
      <button style="background-color:green; color:white; padding: 3px 8px; outline:0">Login Here</button></a>
      <p style="margin-bottom: 0">You can copy and paste to browser if above link is not clickable.</p>
      <code>${process.env.UI_URL}/login</code>
      <br>
      <p>${process.env.APP_NAME} &copy; ${new Date().getFullYear()}</p>`;

      sendEmailSms({ emailRecipients: [user.email], emailBody: message, emailSubject: `${process.env.APP_NAME} Account Created.` });

      return Response.send(res, codes.created, {
        data: { message: 'The user account has been created successfully and user notified.' },
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles user login.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async login(req, res) {
    const { email, password } = req.body;
  
    try {
      let user = await getUser(email);

      if (!user || !await bcrypt.compareSync(password, user.password || '')) {
        return Response.send(res, codes.unAuthorized, {
          error: `Invalid Email address or password.`,
        });
      }

      user = user.toObject();
      delete user.password;
      delete user.emailtoken;

      const token = TokenUtil.sign(user);
      res.cookie('authorization', token, { maxAge: 900000, httpOnly: true });
      return Response.send(res, codes.success, {
        data: { token, user },
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles user request to reset password, and sends password reset email.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async requestResetPassword(req, res) {
    const { email } = req.body;
   
    try {
      const user = await getUser(email);

      if (!user) {
        return Response.send(res, codes.badRequest, {
          error: 'User does not exist.',
        });
      }

      const userEmail = user.email || user.merchant_email;

      if (!userEmail) {
        return Response.send(res, codes.badRequest, {
          error: 'No email associated with this account, contact the admin!',
        });
      }

      const emailtoken = Math.random().toString(15).substring(2);
      const message = `<b>Hello ${user.firstname}</b><br>
      <p>You requested to reset your password on ${process.env.APP_NAME}.</p>
      <p>Click on the link below to reset your password</p>
      <a href="${process.env.UI_URL}/auth/verify?email=${email}&token=${emailtoken}">
      <button style="background-color:green; color:white; padding: 3px 8px; outline:0">Reset Password</button></a>
      <p>You can copy and paste to browser.</p>
      <code>${process.env.UI_URL}/auth/verify?email=${email}&token=${emailtoken}</code>
      <p>Kindly ignore, if you didn't make the request</p><br>
      <p>${process.env.APP_NAME} &copy; ${new Date().getFullYear()}</p>`;

      sendEmailSms({ emailRecipients: [userEmail], emailBody: message, emailSubject: 'Reset Password Confirmation' });

      user.emailtoken = emailtoken;
      await user.save();

      return Response.send(res, codes.success, {
        data: {
          message: 'Check your email for password reset link.',
          email,
        },
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  /**
  * This handles user changing a users password: with emailtoken or authenticated user token.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async resetPassword(req, res) {
    const { token, email, password: pass } = req.body;
    let user = null;

    try {
      if (token) {
        user = await getUser(email, { emailtoken: token });
      } else {
        // Get the logged in user from authorization in param: req
        const loggedIn = getUserFromToken(req);
        if (!loggedIn.status) {
          return Response.send(res, codes.unAuthorized, {
            error: loggedIn.error,
          });
        }
        const uID = loggedIn.user.email;
        isMerchant = !validateEmail(uID);
        user = await getUser(uID, isMerchant);
      }

      if (!user) {
        return Response.send(res, codes.badRequest, {
          error: 'Invalid link, kindly re-request for password reset.',
        });
      }

      const password = bcrypt.hashSync(pass, 10);
      user.password = password;
      user.emailtoken = '';
      await user.save();
      return Response.send(res, codes.success, {
        data: {
          message: 'Password changed successfully.',
          email,
        },
      });
    } catch (error) { return Response.handleError(res, error); }
  }
}

const getUser = async (uId, filter) => {
  if (typeof filter !== 'object' || !filter) filter = {};

  let user = null;
  user = await User.findOne({ email: uId, ...filter });

  return user;
};

export default new AuthController();
