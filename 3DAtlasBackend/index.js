const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 4000
const userController = require('./Controllers/UserController.js')
const authController = require('./Controllers/AuthentificationController.js')
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', userController.getUsers)

app.post('/createUser',userController.createUser)

app.get('/users/:id', userController.getUserById)

app.put('/users/:id', userController.updateUser)

app.delete('/users/:id', userController.deleteUser)

app.post('/login',authController.Login)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})