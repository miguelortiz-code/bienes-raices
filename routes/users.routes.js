import express from 'express';
import {login, register, forgotPassword, registerForm, ConfirmAccount} from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas GET
router.get('/login', login);
router.get('/register', register);
router.get('/recover-password', forgotPassword);
router.get('/confirm-account/:token',ConfirmAccount);
// Rutas POST
router.post('/register', registerForm);


export default router