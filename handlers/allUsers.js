
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const isAuthenticated = require("./isAuthenticated");
const isAdmin = require("./isAdmin");

async function allUsers(request){
  try{
    let user = await isAuthenticated(request);
    let admin = isAdmin(user);

    if (user && admin){
      const params = {
        TableName: "users-table"
      };

      let users = await docClient.scan(params).promise();
      return users.Items;
    } else {
      return {
        error: "You are not authorized to make this request"
      }
    }
  } catch(err){
    console.log(err);
  }
}

module.exports = allUsers;
