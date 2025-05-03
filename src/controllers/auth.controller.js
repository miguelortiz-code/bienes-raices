
import Users from '../models/auth.model.js';
const formularioLogin  =  (req, res) =>{
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegister  =  (req, res) =>{
    res.render('auth/register', {
        pagina: 'Crear Cuenta'
    });
}

const register = async (req, res) =>{
    const user = await Users.create(req.body);
    res.json(user);
};


const formularioRecoveryPassword  =  (req, res) =>{
    res.render('auth/recover-password', {
        pagina: 'Recuperar  Contraseña'
    });
}

export {
    formularioLogin,
    formularioRegister,
    formularioRecoveryPassword,
    register
}