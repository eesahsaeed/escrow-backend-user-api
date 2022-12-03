
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const docClient = new AWS.DynamoDB.DocumentClient();

async function update(request){
  let user = JSON.parse(request.body);

  let params = {};

  if (user.password && user.confirmPassword){
    if (user.password === user.confirmPassword){

      if (user.password.length < 8){
        return {
          errors: {
            password: {message: "password must be at least 8 characters"}, 
            confirmPassword: {message: "password must be at least 8 characters"}
          },
          "_message": "Password must be at least 8 characters"
        }
      }

      const hash = bcrypt.hashSync(user.password, 10);
      
      params = {
        TableName: "users-table",
        Key: {
          id: user.id
        },
        UpdateExpression: `set 
          userName = :userName, 
          firstName = :firstName,
          address = :address,
          middleName = :middleName,
          lastName = :lastName,
          email = :email,
          preferredCommunication = :preferredCommunication,
          gender = :gender,
          country = :country,
          phoneNumber = :phoneNumber,
          dateOfBirth = :dateOfBirth,
          telegram = :telegram,
          employmentStatus = :employmentStatus,
          occupation = :occupation,
          purposeOfEscrowAccount = :purposeOfEscrowAccount,
          sourceOfFunds = :sourceOfFunds,
          socialSecurityNumber = :socialSecurityNumber,
          expectedTransactionSizePerTrade = :expectedTransactionSizePerTrade,
          identification = :identification,
          proofOfAddress = :proofOfAddress,
          bankStatement = :bankStatement,
          transactions = :transactions,
          firstForm = :firstForm,
          secondForm = :secondForm,
          password = :password
        `,
        ExpressionAttributeValues: {
          ":userName": user.userName,
          ":firstName": user.firstName,
          ":address": user.address,
          ":middleName": user.middleName,
          ":lastName": user.lastName,
          ":email": user.email,
          ":preferredCommunication": user.preferredCommunication,
          ":gender": user.gender,
          ":country": user.country,
          ":phoneNumber": user.phoneNumber,
          ":dateOfBirth": user.dateOfBirth,
          ":telegram": user.telegram,
          ":employmentStatus": user.employmentStatus,
          ":occupation": user.occupation,
          ":purposeOfEscrowAccount": user.purposeOfEscrowAccount,
          ":sourceOfFunds": user.sourceOfFunds,
          ":socialSecurityNumber": user.socialSecurityNumber,
          ":expectedTransactionSizePerTrade": user.expectedTransactionSizePerTrade,
          ":identification": user.identification,
          ":proofOfAddress": user.proofOfAddress,
          ":bankStatement": user.bankStatement,
          ":transactions": user.transactions,
          ":firstForm": user.firstForm,
          ":secondForm": user.secondForm,
          ":password": hash 
        }
      };
    }
  } else {
    params = {
      TableName: "users-table",
      Key: {
        id: user.id
      },
      UpdateExpression: `set 
        userName = :userName, 
        firstName = :firstName,
        address = :address,
        middleName = :middleName,
        lastName = :lastName,
        email = :email,
        preferredCommunication = :preferredCommunication,
        gender = :gender,
        country = :country,
        phoneNumber = :phoneNumber,
        dateOfBirth = :dateOfBirth,
        telegram = :telegram,
        employmentStatus = :employmentStatus,
        occupation = :occupation,
        purposeOfEscrowAccount = :purposeOfEscrowAccount,
        sourceOfFunds = :sourceOfFunds,
        socialSecurityNumber = :socialSecurityNumber,
        expectedTransactionSizePerTrade = :expectedTransactionSizePerTrade,
        identification = :identification,
        proofOfAddress = :proofOfAddress,
        bankStatement = :bankStatement,
        transactions = :transactions,
        firstForm = :firstForm,
        secondForm = :secondForm
      `,
      ExpressionAttributeValues: {
        ":userName": user.userName,
        ":firstName": user.firstName,
        ":address": user.address,
        ":middleName": user.middleName,
        ":lastName": user.lastName,
        ":email": user.email,
        ":preferredCommunication": user.preferredCommunication,
        ":gender": user.gender,
        ":country": user.country,
        ":phoneNumber": user.phoneNumber,
        ":dateOfBirth": user.dateOfBirth,
        ":telegram": user.telegram,
        ":employmentStatus": user.employmentStatus,
        ":occupation": user.occupation,
        ":purposeOfEscrowAccount": user.purposeOfEscrowAccount,
        ":sourceOfFunds": user.sourceOfFunds,
        ":socialSecurityNumber": user.socialSecurityNumber,
        ":expectedTransactionSizePerTrade": user.expectedTransactionSizePerTrade,
        ":identification": user.identification,
        ":proofOfAddress": user.proofOfAddress,
        ":bankStatement": user.bankStatement,
        ":transactions": user.transactions,
        ":firstForm": user.firstForm,
        ":secondForm": user.secondForm
      }
    };
  }

  try{
    let update = await docClient.update(params)
    .promise()
    .then(function(data){
      return data;
    }).catch(function(err){
      return err;
    });

    return {
      data: {
        ...user, 
        password: "", 
        confirmPassword: "",
      },
      success: true
    };
  } catch(err){
    console.log("Error ", err)
    return err;
  }
}

module.exports = update;
