
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

const docClient = new AWS.DynamoDB.DocumentClient();

async function changePassword(request){
  let {email, password, confirmPassword, token} = request.body;

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

      if (password === confirmPassword){
        const hash = bcrypt.hashSync(password, 10)

        let userParams = {
          TableName: "users-table",
          Key: {
            id: user.id
          },
          UpdateExpression: `set 
            forgotPasswordToken = :token,
            password = :password
          `,
          ExpressionAttributeValues: {
            ":token": "",
            ":password": hash
          }
        };

        await docClient.update(userParams).promise();

        return {success: true};
      } else {
        return {
          errors: {
            password: {message: "passwords do not match"}, 
            confirmPassword: {message: "passwords do not match"}
          },
          "_message": "Passwords do not match"
        }
      }

      return {success: true};
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

module.exports = changePassword;
