import express from 'express';
import {login, register, forgotPassword, registerForm, ConfirmAccount, resetPassword, checkToken, newPassword, loginForm} from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas GET
router.get('/login', login);
router.get('/register', register);
router.get('/recover-password', forgotPassword);
router.get('/confirm-account/:token',ConfirmAccount);
// Rutas POST
router.post('/register', registerForm);
router.post('/login', loginForm);
router.post('/recover-password', resetPassword);

// Almacenar nueva contraseña
router.get('/recover-password/:token', checkToken);
router.post('/recover-password/:token', newPassword);
export default router