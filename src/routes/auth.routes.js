import express from 'express';
import { formularioLogin, formularioRegister } from '../controllers/auth.controller.js';
const router =  express.Router();

router.get('/login', formularioLogin);

router.get('/register', formularioRegister)

export default router;