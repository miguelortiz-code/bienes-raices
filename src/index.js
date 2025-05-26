import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import UsersRoutes from './routes/auth.routes.js';
import connectDB from './config/connection.js';

// Crear la app
const app  = express();

// Conexión a la base de datos
connectDB();

// Habilitar los request
app.use(express.urlencoded({extended: true}));

// Habilitar cookie parser
app.use(cookieParser());

// Habilidar el CSRF
app.use(csrf({cookie: true}))
// Habilitar pug
app.set('view engine', 'pug');
app.set('views', './src/views');

// FOLDER PUBLIC
app.use(express.static('./src/public'));

//Routing
app.use('/auth', UsersRoutes);


// Definir el puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log(`El servidor está corriendo en el puerto ${port}`);
});