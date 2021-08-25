const bcrypt = require('bcrypt');
const {response} = require("express");
const saltRounds = 10;


function CryptPassword(password){

    const hash = bcrypt.hashSync(password, 10);

      return hash
}

function ComparePassword(hash,passwordToCompare){
    var resultCompare = null
    resultCompare  = bcrypt.compareSync(passwordToCompare, hash);

    return resultCompare
}


module.exports = { CryptPassword, ComparePassword }
