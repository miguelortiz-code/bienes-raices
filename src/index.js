import express from 'express';
import UsersRoutes from './routes/auth.routes.js';
// Crear la app
const app  = express();

// Habilitar pug
app.set('view engine', 'pug');
app.set('views', './src/views');

//Routing
app.use('/auth', UsersRoutes);


// Definir el puerto y arrancar el proyecto
const port = 3000;
app.listen(port , ()=>{
    console.log(`El servidor está corriendo en el puerto ${port}`);
})