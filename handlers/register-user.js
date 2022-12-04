
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const docClient = new AWS.DynamoDB.DocumentClient();
const {template} = require("./email-template");
const {v4} = require("uuid");
const nodemailer = require("nodemailer");
const CalculateAge = require("calculate-age");

async function register(request){
  let user = JSON.parse(request.body);

  let valid = validate(user);

  if (!valid.valid){
    return valid;
  }

  let confirmPassword = user.confirmPassword;

  try{
    if (user.password === confirmPassword){

      if (user.password.length < 8){
        return {
          errors: {
            password: {message: "password must be at least 8 characters long"}
          },
          "_message": "Password must be at least 8 characters long"
        }
      }

      let age = new CalculateAge(new Date(values.dateOfBirth), new Date()).getObject();

      if (age.years < 18){
        return {
          errors: {
            password: {message: "You must be at least 18 years old to register"}
          },
          "_message": "You must be at least 18 years old to register"
        }
      }

      const hash = bcrypt.hashSync(user.password, 10)
      user.password = hash;
      user.confirmPassword = "";

      if (user.email === "info@escrow-block.com"){
        user.role = "admin";
      } else {
        user.role = "user";
      }

      const params = {
        TableName: "users-table",
        FilterExpression: "userName = :u OR email = :e",
        ProjectionExpression: "userName, email, firstName",
        ExpressionAttributeValues: {
          ":u": user.userName,
          ":e": user.email
        }
      };

      let tempUsers = await docClient.scan(params).promise()
      .then(function(data){
        return data.Items;
      }).catch(function(err){
        return err;
      });

      if (tempUsers.length !== 0){

        let usrname = null;
        let usremail = null;

        tempUsers.forEach(val => {
          if (val.userName === user.userName){
            usrname = val.userName;
          } else if (val.email === user.email){
            usremail = val.email;
          }
        })

        if (usrname && usremail){
          return {
            errors: {
              userName: {message: "User Name already exist"},
              email: {message: "Email Address already exist"},
              exists: true
            },
            "_message": "User Name and Email already exist"
          }
        } else if (usremail){
          return {
            errors: {
              email: {message: "Email Address already exist"},
              exists: true
            },
            "_message": "Email Address already exist"
          }
        } else if (usrname){
          return {
            errors: {
              userName: {message: "Username already exist"},
              exists: true
            },
            "_message": "User Name already exist"
          }
        }
      }

      let id = v4();
      let tempUser = {
        data: {
          ...user, 
          id, 
          password: "", 
          confirmPassword: "",
          firstForm: true
        },
        success: true
      };

      let newUser = await docClient.put({
        TableName: "users-table",
        Item: {
          ...user,
          id,
          firstForm: true
        }
      }).promise()
      .then(function(data){
        return data;
      }).catch(function(err){
        return err;
      });
 
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
        from : '"Welcome to Escrow Block" <info@escrow-block.com>',
        to: user.email,
        subject: "Welcome To Escrow Block",
        Text: "That was easy!",
        html: template(user.firstName),
        attachments: [{
          filename: "logo.png",
          path: "./assets/logo.png",
          cid: "uniquelogo"
        },{
          filename: "logincontainer.png",
          path: "./assets/logincontainer.png",
          cid: "logo-container"
        },{
          filename: "facebook2x.png",
          path: "./assets/facebook2x.png",
          cid: "facebook2x"
        },{
          filename: "twitter2x.png",
          path: "./assets/twitter2x.png",
          cid: "twitter2x"
        },{
          filename: "instagram2x.png",
          path: "./assets/instagram2x.png",
          cid: "instagram2x"
        },{
          filename: "telegram.png",
          path: "./assets/telegram.png",
          cid: "telegram"
        },{
          filename: "mobile.png",
          path: "./assets/mobile.png",
          cid: "mobile"
        },{
          filename: "email.png",
          path: "./assets/email.png",
          cid: "email"
        }]
      };

      await transporter.sendMail(mailOptions);

      return tempUser;
    } else {
      return {
        errors: {
          password: {message: "passwords do not match"}, 
          confirmPassword: {message: "passwords do not match"}
        },
        "_message": "Passwords do not match"
      }
    }
  } catch(err){
    return err;
  }
}

function validate(user){
  let valid = true;
  let errors = {};

  if (!user.userName){
    valid = false;
    errors.userName = {
      message: "User Name is required"
    }
  }

  if (!user.firstName){
    valid = false;
    errors.firstName = {
      message: "First Name is required"
    }
  }

  if (!user.lastName){
    valid = false;
    errors.lastName = {
      message: "Last Name is required"
    }
  }

  if (!user.email){
    valid = false;
    errors.email = {
      message: "Email Address is required"
    }
  }

  if (!user.gender){
    valid = false;
    errors.gender = {
      message: "Gender is required"
    }
  }

  if (!user.country){
    valid = false;
    errors.country = {
      message: "Country is required"
    }
  }

  if (!user.phoneNumber){
    valid = false;
    errors.phoneNumber = {
      message: "Phone Number is required"
    }
  }

  if (!user.dateOfBirth){
    valid = false;
    errors.dateOfBirth = {
      message: "Date Of Birth is required"
    }
  }

  return {valid, errors, "_message": "Validation Error"}
}

module.exports = register;
