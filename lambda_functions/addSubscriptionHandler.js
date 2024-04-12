const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "us-east-1",
  });

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

module.exports = function addSubscriptionHandler(req, res) {
    const { username, musicYear, web_url, artist, img_url, title } = req.body;

    // Define the item to be added to the subscription table
    const item = {
        'username': { 'S': username },
        'year': { 'N': musicYear.toString() }, // Sort key attribute
        'web_url': { 'S': web_url },
        'artist': { 'S': artist },
        'img_url': { 'S': img_url },
        'title': { 'S': title }
    };

    // Construct the parameters for adding the item to the table
    const params = {
        TableName: 'subscription',
        Item: item
    };

    // Execute the putItem operation to add the item to the table
    dynamodb.putItem(params, (err, data) => {
        if (err) {
            console.error('Error adding item to subscription table:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Item added successfully
        res.status(200).json({ message: 'Item added successfully to subscription table' });
    });
};
