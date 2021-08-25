const db = require('../DatabaseConfiguration.js')
const userModel = require('../Models/User.js')
const credentialsModel = require('../Models/Credentials.js')
const encryptpassword = require("../PasswordEncrypter.js")


const Login = (request, response) => {

    const data = request.body
    const credential = new credentialsModel.Credentials();

    credential.setUsername(data.username)
    credential.setPassword(data.password)

    db.pool.query('SELECT * FROM users WHERE username = $1',[credential.getUsername()], (error, results) => {
        if (error) {
            throw error
        }

        if(results.rows.length > 0)
        {
            var user = new userModel.User();
            var element = results.rows[0];
            user.setFirstname(element.first_name)
            user.setLastname(element.last_name)
            user.setEmail(element.username)
            user.setEmail(element.email)
            user.setPassword(element.password)

            if (encryptpassword.ComparePassword(user.getPassword(), credential.getPassword()))
            {
                return response.status(200).json("Login Successfull")
            }

        else
        {
            return response.status(404).json("The Password is incorrect")
        }

        }
        else
        {
            return response.status(404).send(`The username  ${credential.getUsername()} was not found`)
        }
    })
}

module.exports = {Login}