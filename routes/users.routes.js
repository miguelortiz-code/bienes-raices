import express from 'express';
import {login, register, forgotPassword, registerForm} from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas GET
router.get('/login', login);
router.get('/register', register);
router.get('/recover-password', forgotPassword);
// Rutas POST
router.post('/register', registerForm);


export default router