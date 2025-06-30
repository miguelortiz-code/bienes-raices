import express from 'express';
import { properties, newProperty } from '../controllers/properties.controller.js';
const router = express.Router();

router.get('/my-properties', properties);
router.get('/properties/new-property', newProperty);
export default router