import express from 'express';

import usersRoutes from './routes/users.routes.js';
// Crear la app
const app = express();


// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');
// Routing
app.use('/auth', usersRoutes);


// Archivos Públicos
app.use(express.static('public'));



// Definir el puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () =>{
    console.log(`Arrancando el proyecto en el puerto ${port}`);
});