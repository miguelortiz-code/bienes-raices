import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config({path: '.env'})

const db = new Sequelize(process.env.db, process.env.user, process.env.password, {
    host: process.env.server,
    port: 3306,
    dialect: 'mysql',
    define:{
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

export default db;