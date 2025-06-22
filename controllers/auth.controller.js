const login = (req, res) =>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    });
};

const register = (req, res) =>{
    res.render('auth/register',{
        pagina: 'Crea tu Cuenta'
    });
}

const forgotPassword = (req, res) =>{
    res.render('auth/forgot-password', {
        pagina: 'Recupera tu Contraseña'
    })
} 


export {
    login,
    register,
    forgotPassword
}