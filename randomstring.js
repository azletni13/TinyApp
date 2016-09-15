'use scripts'

function generateRandomString() {

  var randomString = "";

  var charset = "abcdefghijklmnopqrstuvwxyz123456789";

  for (var i = 0; i < 6; i++) {
    let randomposition = Math.floor(Math.random() * 37);
    randomString += charset[randomposition];
  }
  return randomString;

}

console.log(generateRandomString());