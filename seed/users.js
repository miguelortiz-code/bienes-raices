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
]

export default users