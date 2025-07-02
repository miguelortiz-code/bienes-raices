import jwt from 'jsonwebtoken';
import { Users } from '../models/index.js';

const protectRoutes =  async (req, res, next) =>{
    // Verificar si exite token
    const {_token} = req.cookies

    if(!_token){
        return res.redirect('/auth/login')
    }
    // Comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.jwtSecret);
        const user = await Users.scope('hideData').findByPk(decoded.id);
        // Almacenar el usuario al Req
        if(user){
            req.user = user
        }else{
            return res.redirect('/auth/login');
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
};

export default protectRoutes