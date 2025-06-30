import bcrypt from 'bcrypt';

const users = [
    {
        name: 'Miguel Ortiz',
        email: 'miguel@gmail.com',
        password: bcrypt.hashSync('Miguel17*', 10),
        token: null,
        confirmed: 1
    }
]

export default users