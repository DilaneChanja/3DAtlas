const db = require('../DatabaseConfiguration.js')
const userModel = require('../Models/User.js')
const {then} = require("pg/lib/native/query");


function getAllUser()
{
    const userList = [];
    db.pool.query('SELECT * FROM  users', (error, results) => {
        if (error) {
            throw error
        }

        {
            for (let i= 0; i < results.rows.length; i++)
            {
                var user = new userModel.User();
                var element = results.rows[i];
                user.setFirstname(element.first_name)
                user.setLastname(element.last_name)
                user.setEmail(element.username)
                user.setEmail(element.email)
                user.setPassword(element.password)

                userList.push(user);

            }
        }

    })
    return userList;
}


function getById(id)
{
    db.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
           return null
        }
       if( results.rows != null)
       {
           const data = results.rows;
           const user = new userModel.User();
           user.setFirstname(data.first_name)
           user.setLastname(data.last_name)
           user.setUsername(data.username)
           user.setEmail(data.email)
           user.setPassword(data.password)

           return user
       }
    })
}


function AddUser(user)
{
    if(user != null )
    {
        db.pool.query('INSERT INTO users (first_name, last_name,username,email,password) VALUES ($1, $2,$3,$4,$5)',
            [user.getFirstname(),user.getLastname(),user.getUsername(),user.getEmail(), user.getPassword()], (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).json(user)

                return response
            })

    }
}

function UpdateById(id, user)
{
    if (id == null)
    {
        return response.status(404).send('The User ID ist incorrect')
    }

    else if (user.first_name == null   || user.last_name == null || user.username == null || user.email == null)
    {
        return response.status(404).send('one input is correct please verify your entries')
    }

    else
    {
        db.pool.query(
            'UPDATE users SET first_name = $1, last_name = $2 , username= $3, email = $4 WHERE user_id = $5',
            [user.first_name, user.last_name,user.username, user.email, id],
            (error, results) => {
                if (error) {

                    return response.status(404).send('The User ID ist incorrect')

                }
               return  response.status(200).send(`User modified with ID: ${id}`)
            }
        )
    }
}

function DeleteById(id)
{
    db.pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            response.status(404).send('the ID doesnt exist')
        }
        return response.status(200).send(`User deleted with ID: ${id}`)
    })
}


module.exports = {
    getAllUser,
    getById,
    UpdateById,
    DeleteById,
    AddUser
}