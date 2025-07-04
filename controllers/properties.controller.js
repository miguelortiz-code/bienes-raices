import { header, validationResult } from 'express-validator';
import {Categories, Prices, Properties} from '../models/index.js';
import { where } from 'sequelize';


// Vista de mis propiedades
const properties = async (req, res) =>{
    const {id} =  req.user;
    const properties = await Properties.findAll({where: {id_user: id},  include: [
      {model: Categories, as: 'category'},
      {model: Prices, as: 'price'}
    ]})


    res.render('properties/mis-properties',{
        pagina: 'Mis propiedades',
        properties
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
        categories,
        prices,
        errors: result.array(),
        data: req.body
    });
   }

   // Crear registro de propiedad
    const {title, description, rooms, bathrooms, parking, street, latitude, longitude, price: id_price, category: id_category} = req.body;
    const {id: id_user} = req.user
    try{
        const  propertySaved = await Properties.create({
            title,
            description,
            rooms,
            bathrooms,
            parking,
            street,
            latitude,
            longitude,
            id_price,
            id_category,
            id_user
        });
    // Obtener el id de la propiedad Creada
    const {code} = propertySaved;
    // Redireccionar al usuario a la visa de subir imagen
    res.redirect(`/properties/add-image/${code}`)
   }catch(error){ 
        console.log(error)
   }
};

// Vista para agregar una nueva imagen a la propiedad creada
const addImageProperty = async (req, res) =>{
    const {code} = req.params
    // Validar que la propiedad exista
    const property = await Properties.findOne({where: {code}})
    if(!property){
        return res.redirect('/my-properties')
    }
    // Validar que la propiedad no este publicada
    if(property.published){
        return res.redirect('/my-properties')
    }
    // Validar que la propiedad pertenece a quien visita la página
    if(req.user.id.toString() !== property.id_user.toString()){
        return res.redirect('/my-properties')
    }

    res.render('properties/add-image',{
        pagina: `Agregar Imagen: ${property.title}`,
        csrfToken: req.csrfToken(),
        property,
    })
}

// Funcion para almacenar la imagen
const storageImage = async (req, res) => {
  const { code } = req.params;

  try {
    // Validar que la propiedad exista
    const property = await Properties.findOne({ where: { code } });
    if (!property) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    // Validar que no esté publicada
    if (property.published) {
      return res.status(403).json({ error: 'La propiedad ya está publicada' });
    }

    // Validar propietario
    if (req.user.id.toString() !== property.id_user.toString()) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta propiedad' });
    }

    // Almacenar imagen y publicar propiedad
    property.imagen = req.file.filename;
    property.published = 1;
    await property.save();
    return res.status(200).json({
      success: true,
      message: 'Imagen subida y propiedad publicada',
      filename: req.file.filename,
      redirect: '/my-properties'
    });

  

  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return res.status(500).json({ error: 'Error del servidor al guardar la imagen' });
  }
};

// Vista para el formulario de editar 
const viewEdit = async (req, res) =>{
    const {code }= req.params;
    
    // Validar que la propiedad exista
    const property = await Properties.findOne({where: {code}});
    if(!property){
      return res.redirect('/my-properties');
    }

    // Revisar que la url sea visible solo para el usuario que creo la propiedad
    if(property.id_user.toString() !== req.user.id.toString()){
      return  res.redirect('/my-properties');
    }


    // Consultar el modelo de categorias y de precios
    const [categories, prices ]= await Promise.all([
        Categories.findAll(),
        Prices.findAll()
    ]);
    res.render('properties/edit-property',{
        pagina: `Editar Propiedad: ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    });
}

// función para editar propiedades
const saveChange = async (req, res) =>{
    // Verificar la validacion de los campos
       let result = validationResult(req);

   if(!result.isEmpty()){
        // Consultar el modelo de categorias y de precios
        const [categories, prices ]= await Promise.all([
        Categories.findAll(),
        Prices.findAll()
    ]);
  
    return res.render('properties/edit-property',{
        pagina: 'Editar Propiedad',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        errors: result.array(),
        data: req.body
    });
  }

    const {code }= req.params;
    
    // Validar que la propiedad exista
    const property = await Properties.findOne({where: {code}});
    if(!property){
      return res.redirect('/my-properties');
    }
    // Revisar que la url sea visible solo para el usuario que creo la propiedad
    if(property.id_user.toString() !== req.user.id.toString()){
      return  res.redirect('/my-properties');
    }

    // Actualizar el objeto y actualizarlo
    try {
      // Obtenemos datos del formulario
      const {title, description, rooms, bathrooms, parking, street, latitude, longitude, price: id_price, category: id_category} = req.body;
      property.set({
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
      await property.save();
      res.redirect('/my-properties')
    } catch (error) {
      console.log(error);
    }

};

export { properties, newProperty, saveProperty, addImageProperty, storageImage, viewEdit, saveChange }