import express from 'express';
import {login, register, forgotPassword} from '../controllers/auth.controller.js';

const router = express.Router();


router.get('/login', login);
router.get('/register', register);
router.get('/recover-password', forgotPassword);


export default router