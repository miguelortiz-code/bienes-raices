import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Users from "../models/auth.model.js";
import { generateJWT, generateId } from "../helpers/token.js";
import { emailRegister, emailResetPassword } from "../helpers/emails.js";


// Vista del formulario de login
const login = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

// Función para cerrar sesión
const logout = (req, res)=>{
  return res.clearCookie('_token').status(200).redirect('/auth/login')
};

// Función para validar el formulario de login
const loginForm = async (req, res) => {
  // Validación de campos
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

  let result = validationResult(req);

  // Verificar si el resultado es vacio
  if (!result.isEmpty()) {
    // Errores
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  // Comprobar si el usuario existe
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El correo ingresado no se encuentra registrado" }],
    });
  }

  // Comprobar si el usuario confirmo la cuenta
  if (!user.confirmed) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Tu cuenta aún no ha sido confirmada. Revisa tu correo para activarla." }],
    });
  }

  // Comprobar el password
  const checkPassword  = await bcrypt.compare(password, user.password);
  if(!checkPassword){
    return res.render('auth/login', {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: [{msg: 'El usuario y/o la contraseña son incorrectos'}]
    });
  }

  // Autenticar al usuario
  const token = generateJWT({id: user.id, name: user.name})
  // Almacenar el JWT en una  cookie
  return res.cookie('_token', token,{
    httpOnly: true,
    secure: true,
    sameSite: true
  }).redirect('/my-properties');
};

// Vista del formulario de registro
const register = (req, res) => {
  res.render("auth/register", {
    pagina: "Crea tu Cuenta",
    csrfToken: req.csrfToken(),
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
  const { name, email, password } = req.body;
  // Verificar que el usuario ya se encuentre registrado
  const existUser = await Users.findOne({ where: { email } });
  if (existUser) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El usuario ya se encuentra registrado" }],
      user: {
        name,
        email,
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await Users.create({
    name,
    email,
    password: hashedPassword,
    token: generateId(),
  });

  // Enviar mensaje de confirmación
  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  // Mostrar mensaje de confirmación
  res.render("templates/mensaje", {
    pagina: "Cuenta Creada correctamente",
    message:
      "Te hemos enviado un correo con un enlace de confirmación. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.",
  });
};

// Función para confirmar cuenta
const ConfirmAccount = async (req, res) => {
  const { token } = req.params; // Extraer el token de la url
  const user = await Users.findOne({ where: { token } }); // Verificar si el token es valido

  if (!user) {
    return res.render("auth/confirm", {
      pagina: "Error al confirmar tu cuenta",
      message:
        "La cuenta no existe o el enlace de confirmación no es válido. Intenta nuevamente.",
      error: true,
    });
  }

  // Confirmar cuenta del usuario
  user.token = null;
  user.confirmed = true;
  await user.save();
  res.render("auth/confirm", {
    pagina: "Cuenta confirmada",
    message:
      "Tu cuenta ha sido confirmada exitosamente. Ya puedes iniciar sesión y comenzar a publicar tus propiedades.",
  });
};

// Vista para recordar la contraseña
const forgotPassword = (req, res) => {
  res.render("auth/forgot-password", {
    pagina: "Recupera tu Contraseña",
    csrfToken: req.csrfToken(),
  });
};

// Función para reestablecer la contraseña
const resetPassword = async (req, res) => {
  // Validación de campos
  await check("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("El formato del correo no es valido")
    .run(req);
  let result = validationResult(req);

  // Verificar si el resultado es vacio
  if (!result.isEmpty()) {
    // Errores
    return res.render("auth/forgot-password", {
      pagina: "Recupera tu contraseña",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }
  // Buscar al usuario por medio del email
  const { email } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    res.render("auth/forgot-password", {
      pagina: "Recupera tu contraseña",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El correo electrónico no se encuentra registrado" }],
    });
  }

  // Generar nuevo token
  user.token = generateId();
  await user.save();

  // Enviar Email
  emailResetPassword({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  // Renderizar vista
  res.render("templates/mensaje", {
    pagina: "Restablece tu contraseña",
    message:
      "Te hemos enviado un correo con las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.",
  });
};

// Función para verificar token de cambio de contraseña
const checkToken = async (req, res) => {
  const { token } = req.params; // Extraer token de la url
  const user = await Users.findOne({ where: { token } }); // Consultar al usuario mediante el token
  if (!user) {
    // Error si el usuario no existe
    return res.render("auth/confirm", {
      pagina: "Error al reestablecer tu contraseña",
      message:
        "La cuenta no existe o el enlace para restablecer la contraseña no es válido o ha expirado. Por favor, solicita uno nuevo.",
      error: true,
    });
  }

  // Mostrar el formulario para cambiar la contraseña
  res.render("auth/reset-password", {
    pagina: "Reestablece tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

// Función para almacenar nueva contraseña
const newPassword = async (req, res) => {
  // Validar campos
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
    return res.render("auth/reset-password", {
      pagina: "Reestablece tu contraseña",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }
  const { token } = req.params;
  const { password } = req.body;
  // Identificar que usuario realiza el cambio de contraseña
  const user = await Users.findOne({ where: { token } });
  // Hashear password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;
  await user.save();

  // Mostrar vista de cambio exitoso
  res.render("auth/confirm", {
    pagina: "Cambio exitoso",
    message:
      "Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.",
  });
};

export {
  login,
  logout,
  register,
  forgotPassword,
  registerForm,
  loginForm,
  ConfirmAccount,
  resetPassword,
  checkToken,
  newPassword,
};
