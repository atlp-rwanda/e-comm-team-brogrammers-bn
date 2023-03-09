

import express from 'express';
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import signupVatidate from '../middlewares/signupValidate';
import isAuthenticated  from '../middlewares/verifyToken'
const routes = express();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);

export default routes;