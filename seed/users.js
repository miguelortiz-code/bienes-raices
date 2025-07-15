import bcrypt from 'bcrypt';

const users = [
    {
        name: 'Miguel Ortiz',
        email: 'miguel@gmail.com',
        password: bcrypt.hashSync('Miguel17*', 10),
        token: null,
        confirmed: 1
    },
    {
        name: 'Esperanza',
        email: 'esperanza@gmail.com',
        password: bcrypt.hashSync('Esperanza', 10),
        token: null,
        confirmed: 1
    },
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
        password: bcrypt.hashSync('Prueba123*', 10),
        token: null,
        confirmed: 1
    },
]

export default users