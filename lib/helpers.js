/**
 * Provides helper method needed for the rest of the application.
 * - Convert JSON data to object
 **/

var crypto = require('crypto');
var config = require('./config');

var helpers = {};

/**
 * Helps you hash your password.
 **/
helpers.hashPassword = (str) => {

  if (typeof(str) == 'string' && str.length > 0) {
     var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
     return hash;
  } else {
    return false;
  }
};

/**
 * As the name suggests, converts a normal string data into JSON object
 * recognised by JS.
 **/
helpers.convertJsonToObject = (strData) => {
  try {
    var obj = JSON.parse(strData);
    return obj;
  } catch(e) {
    return {};
  }
}

/**
 * Main task is to generate random characters upto length specified by the user.
 **/
helpers.generateRandomId = (strLength) => {

  const tokenLength = typeof(strLength) == 'number' && strLength > 0
                        ? strLength : false;
  if (tokenLength) {
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var token = '';
    for (var i = 1; i <= tokenLength; i++) {
      var randomChar = possibleCharacters.charAt(Math.floor(Math.random()
      * possibleCharacters.length));
      token += randomChar;
    }
    return token;
  } else {
    return false;
  }
};

/**
 * Checks if the string has any lowercase letter
 **/
helpers.hasLowerCase = (str) => {
    return (/[a-z]/.test(str));
}

/**
 * Checks if the string has any lowercase letter
 **/
helpers.hasUpperCase = (str) => {
    return (/[A-Z]/.test(str));
}

/**
 * Checks if the string has any lowercase letter
 **/
helpers.hasNumber = (str) => {
    return (/[0-9]/.test(str));
}

/**
 * Checks if the string has special character
 **/
helpers.hasSpecialCharacter = (str) => {
 return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(str);
}

/**
 * Checks if the password is valid
 **/
helpers.validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

helpers.isSatisfyPasswordPolicy = (password) => {
  var password = typeof(password) == 'string' && password.trim().length >= config.passwordLength
                                  ? password : false;
  if (!password) {
    return false;
  }

  if (!helpers.hasUpperCase(password)) {
    return false;
  }

  if (!helpers.hasSpecialCharacter(password)) {
    return false;
  }

  if (!helpers.hasNumber(password)) {
    return false;
  }

  return true;
}

module.exports = helpers;
