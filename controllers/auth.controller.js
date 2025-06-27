import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Users from "../models/auth.model.js";
import generateId from "../helpers/token.js";

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

  res.json(user);

};


// Vista para recordar la contraseña
const forgotPassword = (req, res) => {
  res.render("auth/forgot-password", {
    pagina: "Recupera tu Contraseña",
  });
};

export { login, register, forgotPassword, registerForm };
