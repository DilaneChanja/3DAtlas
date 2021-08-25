
class Credentials{

    constructor()
    {
        this._username = ''
        this._password = ''
    }


    getUsername() {
        return this._username;
    }

    setUsername(username) {
        this._username = username;
    }

    getPassword() {
        return this._password;
    }

    setPassword(password) {
        this._password = password;
    }
}

module.exports = { Credentials }
