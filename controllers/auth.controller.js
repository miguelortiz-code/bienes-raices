import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Users from "../models/auth.model.js";
import {generateId} from "../helpers/token.js";
import {emailRegister} from '../helpers/emails.js';
import { where } from "sequelize";

// Vista del formulario de login
const login = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

// Vista del formulario de registro
const register = (req, res) => {
  res.render("auth/register", {
    pagina: "Crea tu Cuenta",
    csrfToken: req.csrfToken()
  });
};

// Función para validar el formulario de registro
const registerForm = async (req, res) => {
  // Validación de campos
  await check("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("El formato del correo no es valido")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener minino 6 caracteres")
    .run(req);
  await check("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    })
    .run(req);
  let result = validationResult(req);

  // Verificar si el resultado es vacio
  if (!result.isEmpty()) {
    // Errores
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }
  // Extraer datos
  const { name, email, password} = req.body;
  // Verificar que el usuario ya se encuentre registrado
  const existUser = await Users.findOne({ where: { email } });
  if (existUser) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errors: [{msg: 'El usuario ya se encuentra registrado'}],
      user: {
        name,
        email,
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword  = await bcrypt.hash(password, salt);

  const user = await Users.create({
    name,
    email,
    password : hashedPassword,
    token: generateId()
  });

  // Enviar mensaje de confirmación
  emailRegister({
      name: user.name,
      email: user.email,
      token: user.token
  });

  
  // Mostrar mensaje de confirmación
  res.render('templates/mensaje', {
    pagina: 'Cuenta Creada correctamente',
    message: 'Te hemos enviado un correo con un enlace de confirmación. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.',
  });
};

// Función para confirmar cuenta
const ConfirmAccount = async (req, res) =>{
    const { token } = req.params; // Extraer el token de la url
    const user = await Users.findOne({where: {token}});  // Verificar si el token es valido
    // console.log(user);

    if(!user){
      return res.render('auth/confirm',{
        pagina: 'Error al confirmar tu cuenta',
        message: 'La cuenta no existe o el enlace de confirmación no es válido. Intenta nuevamente.',
        error: true
      })
    }
    
    // Confirmar cuenta del usuario
    user.token = null;
    user.confirmed = true;
    await user.save();
    res.render('auth/confirm', {
      pagina: 'Cuenta confirmada',
      message: 'Tu cuenta ha sido confirmada exitosamente. Ya puedes iniciar sesión y comenzar a publicar tus propiedades.'
    });
};

// Vista para recordar la contraseña
const forgotPassword = (req, res) => {
  res.render("auth/forgot-password", {
    pagina: "Recupera tu Contraseña",
  });
};

export { login, register, forgotPassword, registerForm, ConfirmAccount };
