const crypto = require("crypto");

class User{

    constructor() {
        this._id = crypto.randomBytes(16).toString("hex");
        this._firstname = ''
        this._lastname = ''
        this._username = ''
        this._email = ''
        this._password = ''
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    getFirstname() {
        return this._firstname;
    }

    setFirstname(firstname) {
        this._firstname = firstname;
    }

    getLastname() {
        return this._lastname;
    }

    setLastname(lastname) {
        this._lastname = lastname;
    }

    getUsername() {
        return this._username;
    }

    setUsername(username) {
        this._username = username;
    }

    getEmail() {
        return this._email;
    }

    setEmail(email)
    {
        this._email = email;
    }

    getPassword() {
        return this._password;
    }

    setPassword(password) {
        this._password = password;
    }

    SetAndValidateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       if(re.test(email))
       {
           this._email = email;
       }
    }
}

module.exports = { User }

