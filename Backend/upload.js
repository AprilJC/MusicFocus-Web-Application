var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

// A helper function that concatenates the addresses
function getAddress(result){
    var addr = result.location.address1;
    if (result.location.address2 === null || result.location.address2 === "")
        return addr;
    addr = addr + result.location.address2;
    if (result.location.address3 === null || result.location.address3 === "")
        return addr;
    return addr + result.location.address3;
}

console.log("Importing music info into DynamoDB. Please wait.");

// Read data into program from local file
var Allmusic = JSON.parse(fs.readFileSync('music.json', 'utf8'));

// Iterate through each JSON object, upload to DynamoDB
Allmusic.forEach(function(album) {

    var params = {
        TableName: "music",
        Item: {
            // Extract two primary keys
            "id":  album.id.replace(/-|\//g, "_"),
            "name": album.name.replace(/-|\//g, "_"),
            "cover_url":album.cover,
            "url": album.id+".html",
            "artist": album.artist.name.replace(/-|\//g, "_"),
            "artist_id":album.artist.id.replace(/-|\//g, "_"),
            "insertedAtTimestamp": new Date().toISOString()
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add music", album.name, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", album.name);
        }
    });
});