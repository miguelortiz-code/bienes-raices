import { raw } from 'mysql2';
import {Categories, Prices, Properties} from  '../models/index.js';

const home = async (req, res) =>{
    const [categories, prices] = await Promise.all([
        Categories.findAll({raw: true}),
        Prices.findAll({raw: true})
    ]);
    console.log(categories);
    res.render('home', {
        pagina: 'Inicio',
        categories,
        prices
    })
};

const category = (req, res) => {

}

const notfound = (req, res) => {

}

const search = (req, res) => {

}

export {
    home,
    category,
    notfound,
    search
}