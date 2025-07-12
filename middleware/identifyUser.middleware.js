import jwt from 'jsonwebtoken';
import Users from '../models/auth.model.js';

const identifyUser = async (req, res, next) =>{
    // Identificar si existe token
    const {_token} = req.cookies
    if(!_token) {
        req.user = null;
        return next();
    }

    // Comprobar token
    try {
        const decoded = jwt.verify(_token, process.env.jwtSecret);
        const user = await Users.scope('hideData').findByPk(decoded.id);
        if(user){
            req.user = user
        }
        return next()
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
};

export default identifyUser