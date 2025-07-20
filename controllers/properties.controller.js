import { validationResult } from 'express-validator';
import cloudinary from '../config/cloudinary.js';
import {Categories, Prices, Properties, Messages, Users} from '../models/index.js';
import {isSalesPerson, formatDate} from '../helpers/identifyUser.js';


// Vista de mis propiedades
const properties = async (req, res) =>{
    // LEER QUERY STRING
    const {page} = req.query

    const expression = /^[1-9]$/
    if(!expression.test( page)){
      return res.redirect('my-properties?page=1')
    }

    try {
      const {id} =  req.user;  
      // Limites y Offset para el paginador
      const limit = 5;
      const offset = (( page * limit) - limit)
      
      const [properties, total] = await Promise.all([
        Properties.findAll({
          limit,
          offset,
          where: {id_user: id},
          include: [
            { model: Categories, as: 'category'},
            { model: Prices, as: 'price'},
            { model: Messages, as: 'messages'}
        ]}),
        Properties.count({
          where:{
              id_user: id
          }
        })
      ]);

      res.render('properties/mis-properties',{
          pagina: 'Mis propiedades',
          properties,
          csrfToken: req.csrfToken(),
          pages: Math.ceil(total / limit),
          page: Number(page),
          total,
          offset,
          limit,
          CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
      });
    } catch (error) {
      console.log(error)
    }
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
    const property = await Properties.findOne({ where: { code } });
    if (!property) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    if (property.published) {
      return res.status(403).json({ error: 'Ya publicada' });
    }

    if (req.user.id.toString() !== property.id_user.toString()) {
      return res.status(403).json({ error: 'Sin permiso' });
    }

    // Obtener info de la imagen desde Cloudinary
    const resource = await cloudinary.api.resource(req.file.filename);
    const publicId = resource.public_id.split('/').pop();
    const fileName = `${publicId}.${resource.format}`;

    property.imagen = fileName;
    property.published = true;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Imagen subida y propiedad publicada',
      redirect: '/my-properties'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
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

// Función para eliminar una propiedad
const deleteProperty = async (req, res) =>{
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

    // Eliminar la imagen de Cloudinary
    if (property.imagen) {
      const publicId = property.imagen.split('.').shift();

        try {
          await cloudinary.uploader.destroy(`properties/${publicId}`);
        } catch (error) {
          console.log(`❌ Error eliminando imagen de Cloudinary: ${error}`);
        }
    }

    // Eliminar propiedad
    await property.destroy();
    res.redirect('/my-properties');
}

// Modificar el estado de la propiedad
const changeState = async (req, res) =>{
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
    // Actualizar estado de la propiedad
    property.published = !property.published;
    await property.save();
    res.json({
      result: true
    });
};

// MOSTRAR UNA PROPIEDAD
const showProperty = async (req, res) =>{
  const {code} = req.params

  // Comprobar que la propiedad exista
  const property = await Properties.findOne({where: {code}, include: [
    {model: Categories, as: 'category'},
    {model: Prices, as: 'price'}
  ]});

  if(!property || !property.published){
    return res.redirect('/404')
  }

  res.render('properties/show-property', {
    pagina: property.title,
    property,
    csrfToken: req.csrfToken(),
    user: req.user,
    isSalesPerson: isSalesPerson(req.user?.id, property.id_user),
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  });
}

// Función para mandar un mensaje al vendedor
const sendMessage = async (req, res) =>{
  const {code} = req.params

  // Comprobar que la propiedad exista
  const property = await Properties.findOne({where: {code}, include: [
    {model: Categories, as: 'category'},
    {model: Prices, as: 'price'}
  ]});

  if(!property){
    return res.redirect('/404')
  }

  // Renderizar errores
  let result = validationResult(req);
  if(!result.isEmpty()){
    return  res.render('properties/show-property', {
      pagina: property.title,
      property,
      csrfToken: req.csrfToken(),
      user: req.user,
      isSalesPerson: isSalesPerson(req.user?.id, property.id_user),
      errors: result.array()
    });
  }
  // Almacenar Mensaje
  try{
    const {message} = req.body;
    const id_property = property.id;
    const {id: id_user} = req.user
    await Messages.create({
      message,
      id_property,
      id_user,
    });
  }catch(error){
    console.log(error)
  }
  // Direccionar al usuario al inicio de la página
  res.redirect('/');
};


// Leer mensajes recibidos
const seeMessage = async (req, res) =>{
  // Obtener el code de la url de la propiedad seleccionada
  const {code } = req.params;
  
  // Validar que la propiedad exista
  const property = await Properties.findOne(
    {
      where: {code},
      include: [
        { 
          model: Messages, as: 'messages',
          include: [
            {model: Users.scope('hideData'), as: 'user'}
          ]
        },

      ]
    },
  );

  if(!property){
    return res.redirect('/my-properties');
  }

  // Revisar que quien visita la URL, es quien creo la propiedad
  if(property.id_user.toString() !== req.user.id.toString()){
    return res.redirect('/my-properties');
  }

  res.render('properties/message',{
    pagina: `Mensajes de la propiedad ${property.title}`,
    messages: property.messages,
    property,
    formatDate
  })
};

export { properties, newProperty, saveProperty, addImageProperty, storageImage, viewEdit, saveChange, deleteProperty, changeState, showProperty, sendMessage, seeMessage }