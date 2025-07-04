import {exit} from 'node:process';
import {Categories, Prices, Users} from '../models/index.js';

// Categorias
import categories from "./categories.js";
// Precios
import prices from './prices.js';
// Usuarios
import users from './users.js';
// Conexion a la base de datos
import db from '../config/db.js';

// función para importar datos
const importData = async () =>{
    try {
        // Autenticar
        await db.authenticate();
        
        //  Generar columnas
        await db.sync();

        // Insertar datos
        await Promise.all([
            Categories.bulkCreate(categories),
            Prices.bulkCreate(prices),
            Users.bulkCreate(users),
        ]);

        console.log('Datos importados correctamente');
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
};

// Función para eliminar datos
const deleteData = async () =>{
    try {
        await db.sync({force: true});
        console.log("Datos elimiandos correctamente");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === '-i'){
    importData();
}

if(process.argv[2] === '-d'){
    deleteData();
}