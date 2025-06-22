import express from 'express';

const router = express.Router();


router.get('/', (req, res) =>{
    res.send('Iniciando la aplicación de bienes raices');
});



export default router