import bcrypt from 'bcrypt';

const users = [
    // usuarios de prueba
    {
        name: 'Prueba',
        email: 'prueba@gmail.com',
        password: bcrypt.hashSync('Prueba123', 10),
        token: null,
        confirmed: 1
    },

    {
        name: 'Prueba 2',
        email: 'correo@gmail.com',
        password: bcrypt.hashSync('Prueba123.', 10),
        token: null,
        confirmed: 1
    },
]

export default users