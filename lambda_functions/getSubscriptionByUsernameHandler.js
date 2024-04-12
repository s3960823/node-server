const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "us-east-1",
  });

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

module.exports = function getSubscriptionByUsernameHandler(req, res) {
    const { username } = req.body;
    
    // Check if username is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Define the parameters for the query
    const params = {
        TableName: 'subscription',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': { 'S': username }
        }
    };

    // Execute the query to retrieve subscription data by username
    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error('Error querying subscription table:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If no items matched the query
        if (data.Items.length === 0) {
            return res.status(404).json({ message: 'No subscription data found for the username' });
        }

        // Return the subscription data
        res.status(200).json(data.Items);
    });
};
