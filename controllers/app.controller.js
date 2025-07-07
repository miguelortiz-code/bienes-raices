const home = (req, res) =>{
    res.render('home', {
        pagina: 'Inicio'
    })
};

const category = (req, res) => {

}

const notfound = (req, res) => {

}

const search = (req, res) => {

}

export {
    home,
    category,
    notfound,
    search
}