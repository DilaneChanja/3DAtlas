const db = require('../DatabaseConfiguration.js')
const userModel = require('../Models/User.js')
const encryptpassword = require("../PasswordEncrypter.js")


const getUsers = (request, response) => {
    db.pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    var id = request.params.id

    db.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const data = request.body
    var user = new userModel.User();
    user.setFirstname(data.first_name);
    user.setLastname(data.last_name);
    user.setUsername(data.username);
    user.SetAndValidateEmail(data.email)
    const myEncryptPassword =  encryptpassword.CryptPassword(data.password)
    user.setPassword(myEncryptPassword)

    db.pool.query('INSERT INTO users (first_name, last_name,username,email,password) VALUES ($1, $2,$3,$4,$5)',
        [user.getFirstname(),user.getLastname(),user.getUsername(),user.getEmail(), user.getPassword()], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).json(data)
    })
}

const updateUser = (request, response) => {
    const id = request.params.id
    const data = request.body

    if (id == null)
    {
        return response.status(404).send('The User ID ist incorrect')
    }

    else if (data.first_name == null   || data.last_name == null || data.username == null || data.email == null)
    {
        return response.status(404).send('one input is correct please verify your entries')
    }

    else
    {
        db.pool.query(
            'UPDATE users SET first_name = $1, last_name = $2 , username= $3, email = $4 WHERE user_id = $5',
            [data.first_name, data.last_name,data.username, data.email, id],
            (error, results) => {
                if (error) {

                        return response.status(404).send('The User ID ist incorrect')

                }
                response.status(200).send(`User modified with ID: ${id}`)
            }
        )
    }

}

const deleteUser = (request, response) => {
    const id = request.params.id

    db.pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            response.status(404).send('the ID doesnt exist')
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}