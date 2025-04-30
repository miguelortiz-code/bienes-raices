const formularioLogin  =  (req, res) =>{
    res.render('auth/login', {
         
    });
}

const formularioRegister  =  (req, res) =>{
    res.render('auth/register', {
         
    });
}

export {
    formularioLogin,
    formularioRegister
}