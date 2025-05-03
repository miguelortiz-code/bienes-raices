import express from 'express';
import UsersRoutes from './routes/auth.routes.js';
// Crear la app
const app  = express();

// Habilitar pug
app.set('view engine', 'pug');
app.set('views', './src/views');

// FOLDER PUBLIC
app.use(express.static('./src/public'));

//Routing
app.use('/auth', UsersRoutes);


// Definir el puerto y arrancar el proyecto
const port = 3000;
app.listen(port , ()=>{
    console.log(`El servidor está corriendo en el puerto ${port}`);
})