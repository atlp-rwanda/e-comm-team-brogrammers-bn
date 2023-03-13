import express from 'express';
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import signupVatidate from '../middlewares/signupValidate';

const routes = express();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
routes.patch('/update-password', Users.updatePassword);

export default routes;
