
async function update(request){
  let user = JSON.parse(request.body);

  const params = {
    TableName: "MYTABLE",
    Key: {
      "id": "1"
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
      bankStatement = :bankStatement,
      forgotPasswordToken = :forgotPasswordToken
    `,
    ExpressionAttributeNames: {
      "#MyVariable": "variable23"
    },
    ExpressionAttributeValues: {
      ":x": "hello2",
      ":y": "dog"
    }
  };

  docClient.update(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });
}

module.exports = update;
