const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "us-east-1",
  });

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

module.exports = function registerHandler(req, res) {
    const { email, username, password } = req.body;

    // Validate email format (you can add more validation logic if needed)
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  
    // Check if the email already exists in the login table
    const params = {
      TableName: "login",
      Key: {
        email: { S: email },
      },
    };
  
    dynamodb.getItem(params, (err, data) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (data.Item) {
          // Email already exists, return error
          res.status(400).json({ error: "The email already exists" });
        } else {
          // Email is unique, proceed with registration
          const putParams = {
            TableName: "login",
            Item: {
              email: { S: email },
              user_name: { S: username },
              password: { S: password },
            },
          };
  
          dynamodb.putItem(putParams, (err, data) => {
            if (err) {
              console.error("Error:", err);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              // Registration successful, redirect to login page
              res.status(200).json({ message: "Registration successful" });
            }
          });
        }
      }
    });
  };
  

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
