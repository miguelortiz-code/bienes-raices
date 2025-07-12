import  Properties from './properties.model.js';
import  Users from './auth.model.js';
import  Categories from './categories.model.js';
import  Prices from './prices.model.js';
import Messages from './message.model.js';

// JOINS DE LAS PROPIEDADES
Properties.belongsTo(Prices, {foreignKey: 'id_price'}); // Join de la tabla propiedades con la tabla precios
Properties.belongsTo(Categories, {foreignKey: 'id_category'}); // Join de la tabla propiedades con la tabla categorias
Properties.belongsTo(Users, {foreignKey: 'id_user'}); // Join de la tabla propiedades con la tabla usuarios
// JOIN DE LOS MENSAJES
Messages.belongsTo(Properties, {foreignKey: 'id_property'}); // Join de la tabla mensajes con la tabla propiedades
Messages.belongsTo(Users, {foreignKey: 'id_user'}); // Join de la tabla mensajes con la tabla usuarios


export {Properties, Users, Categories, Prices, Messages}