import db from './db.js';

const connectDB = async () => {
    try {
        await db.authenticate();
        db.sync();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

export default connectDB;