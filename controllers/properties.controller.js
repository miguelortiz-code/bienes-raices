import { validationResult } from 'express-validator';
import {Categories, Prices, Properties} from '../models/index.js';
// Vista de mis propiedades
const properties =  (req, res) =>{
    res.render('properties/mis-properties',{
        pagina: 'Mis propiedades',
        header: true
    })
}

// Vista del formulario para crear las propiedades
const newProperty  = async (req, res) =>{
    // Consultar el modelo de categorias y de precios
    const [categories, prices ]= await Promise.all([
        Categories.findAll(),
        Prices.findAll()
    ]);
    res.render('properties/new-property',{
        pagina: 'Crear nueva propiedad',
        csrfToken: req.csrfToken(),
        header:true,
        categories,
        prices,
        data: {}
    });
}

// Función para validar los campos del formulario de propiedades
const saveProperty  = async (req, res) => {

   let result = validationResult(req);

   if(!result.isEmpty()){
        // Consultar el modelo de categorias y de precios
        const [categories, prices ]= await Promise.all([
        Categories.findAll(),
        Prices.findAll()
    ]);

    return res.render('properties/new-property',{
        pagina: 'Crear nueva propiedad',
        csrfToken: req.csrfToken(),
        header:true,
        categories,
        prices,
        errors: result.array(),
        data: req.body
    });
   }

   // Crear registro de propiedad
    const {title, description, rooms, bathrooms, parking, street, latitude, longitude, price: id_price, category: id_category} = req.body;
   try{
        const  propertiSaved = await Properties.create({
            title,
            description,
            rooms,
            bathrooms,
            parking,
            street,
            latitude,
            longitude,
            id_price,
            id_category
        })
   }catch(error){
        console.log(error)
   }
};

export { properties, newProperty, saveProperty }