import {check, validationResult} from 'express-validator';
import Users from '../models/auth.model.js';
import { json } from 'sequelize';
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
    // validaciones
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').notEmpty( ).withMessage('El correo es obligatorio').run(req);
    await check('email').isEmail().withMessage('El formato del correo electrónico no es valido').run(req);
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener minimo 6 caracteres').run(req);
    await check('confirm_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    
    let result = validationResult(req);

    
    if(!result.isEmpty()){
        return res.render('auth/register', {
            pagina: 'Crear Cuenta',
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }
    

    // Verificar el correo duplicado
    const {name, email, password} = req.body;
    try{
        const existeCorreo = await Users.findOne({where: {email}});
        if (existeCorreo) {
            return res.render('auth/register', {
                pagina: 'Crear Cuenta',
                errors: [{ msg: 'El usuario ya está registrado' }],
                user: {
                    name: req.body.name,
                    email: req.body.email
                }
            });
        }

        await Users.create({
            name,
            email,
            password,
            token:123
        });
        return res.redirect('/auth/login');

    }catch(error){
        console.error(error);
        return res.render('auth/register', {
            pagina: 'Crear Cuenta',
            errors: [{ msg: 'Ocurrió un error al registrar el usuario' }],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }
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