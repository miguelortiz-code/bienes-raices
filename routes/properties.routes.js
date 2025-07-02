import express from 'express';
import {body} from 'express-validator';
import { properties, newProperty, saveProperty } from '../controllers/properties.controller.js';
import protectRoutes from '../middleware/protect.routes.middleware.js';
const router = express.Router();

router.get('/my-properties',protectRoutes, properties);
router.get('/properties/new-property',protectRoutes,  newProperty);
router.post('/properties/new-property',
    protectRoutes,
    body('title').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('description').notEmpty().withMessage('La descripción no puede ir vacia').isLength({max: 250}).withMessage('Has superado la cantidad maxima de 250 caracteres'),
    body('category').isNumeric().withMessage('Debes seleccionar una categoria para la propiedad'),
    body('price').isNumeric().withMessage('Debes seleccionar un rango de precio para la propiedad'),
    body('rooms').isNumeric().withMessage('Debes seleccionar cantidad de baños'),
    body('bathrooms').isNumeric().withMessage('Debes seleccionar cantidad de habitaciones'),
    body('parking').isNumeric().withMessage('Debes seleccionar cantidad de parqueaderos'),
    body('latitude').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    saveProperty);
export default router