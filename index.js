import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import {userRoutes, propertyRoutes, appRoutes, apiRoutes} from './routes/index.routes.js'

import db from './config/db.js';

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

// Habilitar Cookie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({cookie: true}));

// Conexión a la base de datos
try{
    await db.authenticate();
    db.sync();
    console.log('Conexión exitosa a la base de datos');
}catch(error){
    console.log(error);
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');
// Routing
app.use('/', appRoutes);
app.use('/auth', userRoutes);
app.use('/', propertyRoutes);
app.use('/api/', apiRoutes);
// Archivos Públicos
app.use(express.static('public'));



// Definir el puerto y arrancar el proyecto
const port = process.env.backend_port || 3000;
app.listen(port, () =>{
    console.log(`Arrancando el proyecto en el puerto ${port}`);
});