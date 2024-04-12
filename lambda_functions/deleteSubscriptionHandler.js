const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "us-east-1",
  });

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

module.exports = function deleteSubscriptionHandler(req, res) {
    const { username, S, N } = req.body;
    const title = S;
    const year = N;
    // Check if all required attributes are provided
    if (!username || !title || !year) {
        return res.status(400).json({ error: 'Username, title, and year are required' });
    }

    // Define the key and condition expression for the item to be deleted
    const key = {
        'username': { 'S': username },
        'year': { 'N': year.toString() }
    };
    const conditionExpression = 'title = :title';
    const expressionAttributeValues = {
        ':title': { 'S': title }
    };

    // Construct the parameters for deleting the item from the table
    const params = {
        TableName: 'subscription',
        Key: key,
        ConditionExpression: conditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    // Execute the deleteItem operation to remove the item from the table
    dynamodb.deleteItem(params, (err, data) => {
        if (err) {
            console.error('Error deleting item from subscription table:', err);
            if (err.code === 'ConditionalCheckFailedException') {
                return res.status(404).json({ error: 'Item not found or title does not match' });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Item deleted successfully
        res.status(200).json({ message: 'Item deleted successfully from subscription table' });
    });
};
