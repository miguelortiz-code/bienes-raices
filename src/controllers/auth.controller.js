import {check, validationResult} from 'express-validator';
import Users from '../models/auth.model.js';
import { generateId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js'; 



const formularioLogin  =  (req, res) =>{
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegister  =  (req, res) =>{
    res.render('auth/register', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'El usuario ya está registrado' }],
                user: {
                    name: req.body.name,
                    email: req.body.email
                }
            });
        }
        // Almacenar el usuario
       const user = await Users.create({
            name,
            email,
            password,
            token:generateId()
        });

        // Enviar email de confirmación
        emailRegistro({
            name: user.name,
            email: user.email,
            token: user.token
        });

        // Mostrar mensaje de confirmación
        res.render('templates/mensaje',{
            pagina: 'Cuenta creada correctamente',
            mensaje: 'Hemos enviado un mensaje de confirmación, da click en el enlace'
        });

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

// Función para confirma la cuenta del usuario registrado
const confirmEmail = async (req, res, ) =>{

    const {token} = req.params;
    // Verificar si no el token es valido
    const user = await Users.findOne({where: {token}});
    if(!user){
      res.render('auth/confirm-account', {
            pagina: 'Error al confirmar la cuenta',
            mensaje: 'Hubo un error al intentar confirmar tu cuenta, intenta de nuevo',
            error: true
        });
    }


    // Confirmar cuenta del usuario 
    user.token = null;
    user.confirmado = true;
    await user.save();

    res.render('auth/confirm-account', {
            pagina: 'Cuenta confirmada',
            mensaje: 'La cuenta se confirmo correctamente'
    });
};

export {
    formularioLogin,
    formularioRegister,
    formularioRecoveryPassword,
    register,
    confirmEmail
}