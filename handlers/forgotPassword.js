
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const {sendTokenTemplate} = require("./email-template");

const docClient = new AWS.DynamoDB.DocumentClient();

async function forgotPassword(request){
  let body = request.body;

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

      let token = Math.floor(100000 + Math.random() * 900000);

      let userParams = {
        TableName: "users-table",
        Key: {
          id: user.id
        },
        UpdateExpression: `set 
          forgotPasswordToken = :token
        `,
        ExpressionAttributeValues: {
          ":token": token
        }
      };

      await docClient.update(userParams).promise()

      let transporter = nodemailer.createTransport({
        host: "mail.escrow-block.com",
        port: 465,
        secure: true,
        auth: {
          user: "info@escrow-block.com",
          pass: "DeepSky24!"
        }
      });

      let mailOptions = {
        from : '"Reset Password Token" <info@escrow-block.com>',
        to: user.email,
        subject: "Reset Password Token",
        Text: "That was easy!",
        html: sendTokenTemplate(token)
      };

      await transporter.sendMail(mailOptions);

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

module.exports = forgotPassword;
