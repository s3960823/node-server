const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: "us-east-1",
  });

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

module.exports = function searchMusicHandler(req, res) {
  const { title, year, artist } = req.body;

  // Define the search parameters based on the provided fields
  const params = {
    TableName: "music",
    ExpressionAttributeValues: {},
  };

  // Initialize the filter expression
  let filterExpression = "";

  // Handle title filter
  if (title) {
    params.ExpressionAttributeNames = {
      ...params.ExpressionAttributeNames,
      "#title": "title",
    };
    params.ExpressionAttributeValues[":title"] = { S: title };
    filterExpression += "contains(#title, :title)";
  }

  // Handle artist filter
  if (artist) {
    if (filterExpression) filterExpression += " AND ";
    filterExpression += "contains(#artist, :artist)";
    params.ExpressionAttributeNames = {
      ...params.ExpressionAttributeNames,
      "#artist": "artist",
    };
    params.ExpressionAttributeValues[":artist"] = { S: artist };
  }

  // Handle year filter
  if (year) {
    if (filterExpression) filterExpression += " AND ";
    filterExpression += "#year = :year";
    params.ExpressionAttributeNames = {
      ...params.ExpressionAttributeNames,
      "#year": "year",
    };
    params.ExpressionAttributeValues[":year"] = { N: year.toString() };
  }

  // Apply the filter expression if it exists
  if (filterExpression) {
    params.FilterExpression = filterExpression;
  }

  // Execute the scan operation
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error("Error scanning music table:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If no items matched the query
    if (data.Items.length === 0) {
      return res.json({
        message: "No result is retrieved. Please query again",
      });
    }

    // Return the matched music items
    res.status(200).json(data.Items);
  });
};
