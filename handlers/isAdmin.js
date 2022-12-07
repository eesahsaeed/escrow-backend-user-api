
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

function isAdmin(user) {
  if (user.role === "admin"){
    return true;
  } else {
    return false;
  }
}

module.exports = isAdmin;
