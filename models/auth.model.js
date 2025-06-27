import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Users = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,
  },
  { 
    timestamps: true,
    underscored: true
 }
);

export default Users;
