
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const docClient = new AWS.DynamoDB.DocumentClient();

async function login(request){
  let body = JSON.parse(request.body);

  try{
    const params = {
      TableName: "users-table",
      FilterExpression: "email = :e",
      ExpressionAttributeValues: {
        ":e": body.email
      }
    };

    let tempUsers = await docClient.scan(params).promise()
    
    if (tempUsers.Items.length > 0){
      let user = tempUsers.Items[0];

      let token = jwt.sign({email: body.email}, "escrow-block");

      let validPassword = await bcrypt.compare(body.password, user.password);

      if (validPassword){
        if (!user.secondForm){
          return {
            error: "Incomplete registration",
            incomplete: true,
            user: {...user, password: ""}
          }
        } else {
          return {...user, token, password: ""};
        }
      } else {
        return {error: "Incorrect Password"}
      }
    } else {
      return {error: "User not found"}
    }

  } catch(err){
    console.log(err);
    return err;
  }
}

module.exports = login;
