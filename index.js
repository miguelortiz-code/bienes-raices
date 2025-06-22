import express from 'express';

import usersRoutes from './routes/users.routes.js';
// Crear la app
const app = express();


// Routing
app.use('/', usersRoutes);


// Definir el puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () =>{
    console.log(`Arrancando el proyecto en el puerto ${port}`);
});