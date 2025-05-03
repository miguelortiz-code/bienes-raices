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

const formularioRecoveryPassword  =  (req, res) =>{
    res.render('auth/recover-password', {
        pagina: 'Recuperar  Contraseña'
    });
}

export {
    formularioLogin,
    formularioRegister,
    formularioRecoveryPassword
}