
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function update(request){
  let user = JSON.parse(request.body);

  const params = {
    TableName: "users-table",
    Key: {
      id: user.id
    },
    UpdateExpression: `set 
      userName = :userName, 
      firstName = :firstName,
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
      bankStatement = :bankStatement
    `,
    ExpressionAttributeValues: {
      ":userName": user.userName,
      ":firstName": user.firstName,
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
      ":bankStatement": user.bankStatement
    }
  };

  try{
    let update = await docClient.update(params)
    .promise()
    .then(function(data){
      console.log("Updated ", data)
      return data;
    }).catch(function(err){
      console.log("Error ", err)
      return err;
    });

    return update;
  } catch(err){
    console.log("Error ", err)
    return err;
  }
}

module.exports = update;
