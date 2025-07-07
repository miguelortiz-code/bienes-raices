import express from 'express';
import {home, category, notfound, search} from '../controllers/app.controller.js'

const router = express.Router();

// Página de inicio
router.get('/', home);

// Categorias
router.get('/category/:category', category);

// Página 404
router.get('/404', notfound);

// Buscador
router.post('/search', search);

export default router