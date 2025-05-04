import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const Users =  db.define('users',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password :{
        type: DataTypes.STRING,
        allowNull: false
    },

    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks:{
        beforeCreate: async function(users){
            const salt =  await bcrypt.genSalt(10);
            users.password = await bcrypt.hash(users.password, salt);
        }
    }
});

export default Users;