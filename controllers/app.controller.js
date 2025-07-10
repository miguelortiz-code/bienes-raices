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