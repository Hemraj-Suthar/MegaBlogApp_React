import Router from 'express';
import { login, signup, logout, getCurrentUser } from '../controllers/user.controller.js';

const userRoute = new Router();

userRoute.post('/signup', signup);
userRoute.get('/getCurrentUser', getCurrentUser);
userRoute.post('/login', login);
userRoute.post('/logout', logout);

export default userRoute;