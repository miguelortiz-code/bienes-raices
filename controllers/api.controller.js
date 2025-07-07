import {Properties, Prices, Categories} from '../models/index.js'

const properties = async (req, res) =>{
    const properties = await Properties.findAll({
        include:[
            {model: Prices, as: 'price'},
            {model: Categories, as: 'category'}
        ]
    });

    res.json(properties)
}

export { properties}