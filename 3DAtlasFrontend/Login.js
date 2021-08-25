class UserCredentials{

    constructor() {
        this._username = ''
        this._password = ''
    }


    getUsername() {
        return this._username;
    }

    setUsername(value) {
        this._username = value;
    }

    getPassword() {
        return this._password;
    }

    setPassword(value) {
        this._password = value;
    }
}



var userCredentials = new UserCredentials()


function getInfo() {
    userCredentials.setUsername(document.getElementById('username').value)
    userCredentials.setPassword(document.getElementById('password').value)

    var alertbox = document.getElementById('alertbox')

    if (userCredentials.getUsername() == "" || userCredentials.getPassword() == "") {
        addAlert("The username ist incorrect")
        console.log("test")
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:4000/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'username': userCredentials.getUsername(),
            'password':userCredentials.getPassword()
        }));
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
