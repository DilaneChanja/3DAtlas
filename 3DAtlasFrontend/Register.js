
class UserRegister {
    constructor() {
        this._firstname = "";
        this._lastname = "";
        this._password = "";
        this._email = "";
    }


    getFirstname() {
        return this._firstname;
    }

    setFirstname(value) {
        this._firstname = value;
    }

    getLastname() {
        return this._lastname;
    }

    setLastname(value) {
        this._lastname = value;
    }

    getPassword() {
        return this._password;
    }

    setPassword(value) {
        this._password = value;
    }

    getEmail() {
        return this._email;
    }

    setEmail(value) {
        this._email = value;
    }

     validateEmail() {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this._email);
    }
}


var  user = new UserRegister()
var alertbox = document.getElementById('alertbox')

 function getInfo() {

    alertbox.innerHTML = ''

    user.setFirstname( document.getElementById('firstname').value)
    user.setLastname(document.getElementById('lastname').value)
    user.setEmail(document.getElementById('email').value)
    user.setPassword(document.getElementById('passwd').value)



    if (user.getPassword().length < 5) {
        addAlert("The password must be at least 7 characters");
    }

    if (!user.validateEmail()) {
        addAlert("The email ist not valid")
    }

     if(user.getPassword().length > 5 && user.validateEmail() && user.getFirstname() != "" && user.getLastname() !="" )
    {
        console.log("Test")
        window.location = "Login.html"
    }
}


function  addAlert(message){
    alertbox.style.display = "initial"
    var tag = document.createElement("div");
    var Text = document.createTextNode(message)
    tag.className="alert alert-danger"
    tag.appendChild(Text);
    alertbox.append(tag)
}
