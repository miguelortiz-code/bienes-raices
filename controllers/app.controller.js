import { where } from 'sequelize';
import {Categories, Prices, Properties} from  '../models/index.js';

const home = async (req, res) =>{
    const [categories, prices, houses, apartaments] = await Promise.all([
        Categories.findAll({raw: true}),
        Prices.findAll({raw: true}),
        Properties.findAll({
            limit: 3,
            where: {
                id_category: 1
            },
            include :[
                {
                   model: Prices, 
                   as: 'price'
                }
            ],
            order: [['createdAt', 'DESC']]
        }),
        Properties.findAll({
            limit: 3,
            where: {
                id_category: 2
            },
            include :[
                {
                   model: Prices, 
                   as: 'price'
                }
            ],
            order: [['createdAt', 'DESC']]
        }),
    ]);

    res.render('home', {
        pagina: 'Inicio',
        categories,
        prices,
        houses,
        apartaments
    })
};

const category = async (req, res) => {
    // Obtenemos la categoria desde la url
    const {category} = req.params;
    // Consultamos la base de datos sobre la categoria de la url
    const  currentCategory = await Categories.findOne({where: {category}})
    // Comprobar que la categoría exista
    if(!currentCategory){
        return res.redirect('/404');
    }
    // Obtener las propiedades de la categoría
    const properties = await Properties.findAll({
        include: [
            {
                model: Prices,
                as: 'price'
            }
        ],
        where: {
            id_category: currentCategory.id
        }
    });

    // Mostrar página dependiendo la categoria seleccionada
    res.render('category', {
        pagina: `${currentCategory.category} en venta`,
        properties
    })
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