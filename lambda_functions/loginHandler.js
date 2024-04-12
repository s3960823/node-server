const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "us-east-1",
  });

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

module.exports = function loginHandler(req, res) {
  const { email, password } = req.body;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password criteria (e.g., minimum length)
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  // Example query to DynamoDB to check if user exists with provided credentials
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
        console.log(data.Item.user_name.S);
        // User found, redirect to main page
        res.status(200).json({
          message: "Login successful",
          email: email,
          username: data.Item.user_name.S,
        });
      } else {
        // User not found or invalid credentials
        res.status(401).json({ error: "Email or password is invalid" });
      }
    }
  });
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
