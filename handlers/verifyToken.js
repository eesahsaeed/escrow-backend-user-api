
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

const docClient = new AWS.DynamoDB.DocumentClient();

async function verifyToken(request){
  let {email, token} = request.body;

  try{
    const params = {
      TableName: "users-table",
      FilterExpression: "email = :e",
      ExpressionAttributeValues: {
        ":e": email
      }
    };

    let tempUsers = await docClient.scan(params).promise()
    
    if (tempUsers.Items.length > 0){
      let user = tempUsers.Items[0];

      if (Number(token) === Number(user.forgotPasswordToken)){
        return {success: true, email, token};
      } else {
        return {
          error: "invalid token"
        }
      }
    } else {
      return {
        error: {
          error: true,
          errorMessage: "Invalid Email Address"
        }
      }
    }
  } catch(err){
    console.log(err);
    return {
        error: {
          error: true,
          errorMessage: err.message
        }
      };
  }
}

module.exports = verifyToken;
