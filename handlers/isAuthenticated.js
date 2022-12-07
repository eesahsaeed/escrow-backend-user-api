
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function isAuthenticated(request) {
  if (request.headers["Authorization"]){
    let token = request.headers["Authorization"];

    try{
      let decoded = await jwt.verify(token, "escrow-block");

      const params = {
        TableName: "users-table",
        FilterExpression: "email = :e",
        ExpressionAttributeValues: {
          ":e": decoded.email
        }
      };

      let tempUsers = await docClient.scan(params).promise();

      if (tempUsers.Items.length > 0){
        let user = tempUsers.Items[0];

        return user;
      } else {
        return null;
      }
    } catch(err){
      console.log(err);
    }
  } else {
    return {
      error: "You have to be logged in to perform this operation"
    }
  }
}

module.exports = isAuthenticated;
