import express from 'express';
import {body} from 'express-validator';
import { properties, newProperty, saveProperty, addImageProperty, storageImage, viewEdit, saveChange, deleteProperty, showProperty, sendMessage, seeMessage } from '../controllers/properties.controller.js';
import {protectRoutes, upload, identifyUser} from '../middleware/index.middleware.js';
const router = express.Router();

router.get('/my-properties',protectRoutes, properties);
router.get('/properties/new-property',protectRoutes,  newProperty);
router.get('/properties/add-image/:code', protectRoutes, addImageProperty)
router.get('/properties/edit/:code', protectRoutes, viewEdit)
router.get('/property/:code', identifyUser, showProperty); // Area Pública
router.get('/message/:code', protectRoutes, seeMessage);

// Router POST
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

router.post('/properties/add-image/:code', protectRoutes, upload.single('image'), storageImage)
router.post('/properties/edit/:code',
    protectRoutes,
    body('title').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('description').notEmpty().withMessage('La descripción no puede ir vacia').isLength({max: 250}).withMessage('Has superado la cantidad maxima de 250 caracteres'),
    body('category').isNumeric().withMessage('Debes seleccionar una categoria para la propiedad'),
    body('price').isNumeric().withMessage('Debes seleccionar un rango de precio para la propiedad'),
    body('rooms').isNumeric().withMessage('Debes seleccionar cantidad de baños'),
    body('bathrooms').isNumeric().withMessage('Debes seleccionar cantidad de habitaciones'),
    body('parking').isNumeric().withMessage('Debes seleccionar cantidad de parqueaderos'),
    body('latitude').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    saveChange);
// Almacenar Mensaje de los clientes
router.post('/property/:code', identifyUser, 
    body('message').isLength({max:250}).withMessage('Has superado la cantidad maxima de 250 caracteres').isLength({min:30}).withMessage('El mensaje no puede ir vacío o es muy corto'),
    sendMessage); // Area Pública

// Router DELETE
router.post('/properties/delete/:code', protectRoutes, deleteProperty)

export default router