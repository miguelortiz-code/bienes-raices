import { header } from "express-validator";

// Vista de mis propiedades
const properties =  (req, res) =>{
    res.render('properties/mis-properties',{
        pagina: 'Mis propiedades',
        header: true
    })
}

// Vista del formulario para crear las propiedades
const newProperty = (req, res) =>{
    res.render('properties/new-property',{
        pagina: 'Crear nueva propiedad',
        header:true
    });
}

export { properties, newProperty }