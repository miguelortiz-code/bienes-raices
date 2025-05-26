import express from 'express';
import { formularioLogin, formularioRegister, formularioRecoveryPassword, register, confirmEmail} from '../controllers/auth.controller.js';
const router =  express.Router();

router.get('/login', formularioLogin);
router.get('/register', formularioRegister)
router.get('/recover-password', formularioRecoveryPassword)
router.get('/confirmar/:token', confirmEmail)

router.post('/register', register);
export default router;