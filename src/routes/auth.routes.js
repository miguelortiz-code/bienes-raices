import express from 'express';
import { formularioLogin, formularioRegister, formularioRecoveryPassword } from '../controllers/auth.controller.js';
const router =  express.Router();

router.get('/login', formularioLogin);
router.get('/register', formularioRegister)
router.get('/recover-password', formularioRecoveryPassword)

export default router;