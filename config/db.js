import Sequelize from "sequelize";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const isProduction = process.env.NODE_ENV === 'production';

const db = new Sequelize(
    isProduction ? process.env.DB_PROD_NAME : process.env.DB_LOCAL_NAME,
    isProduction ? process.env.DB_PROD_USER : process.env.DB_LOCAL_USER,
    isProduction ? process.env.DB_PROD_PASS : process.env.DB_LOCAL_PASS ?? '',
    {
        host: isProduction ? process.env.DB_PROD_HOST : process.env.DB_LOCAL_HOST,
        port: isProduction ? process.env.DB_PROD_PORT : process.env.DB_LOCAL_PORT,
        dialect: 'mysql',
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorAliases: false
    }
);

export default db;