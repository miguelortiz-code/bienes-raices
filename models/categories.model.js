import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Categories = db.define('categories', {
    category : {
        type: DataTypes.STRING(80),
        allowNull: false
    }
});

export default Categories