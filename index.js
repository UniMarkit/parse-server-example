// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var S3Adapter = require('parse-server').S3Adapter;
var Parse = require ('parse/node');
var path = require('path');
// var Parse = require('parse/node');
require('dotenv').config();

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
	//**** General Settings ****//
	databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed

	//**** Security Settings ****//

	// allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false,
	appId: process.env.APP_ID || 'myAppId',
	masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!


	 liveQuery: {
	 	classNames: ["Conversations", "Messages", "Notifications"] // List of classes to support for query subscriptions
	 },

	//**** Email Verification ****//
	/* Enable email verification */
	 verifyUserEmails: true,
	/* The public URL of your app */
	// This will appear in the link that is used to verify email addresses and reset passwords.
	/* Set the mount path as it is in serverURL */
	 publicServerURL: 'https://unimarkit-official.herokuapp.com/parse',
	/* This will appear in the subject and body of the emails that are sent */
	 appName: process.env.APP_NAME || "UniMarkit-Official",

	 emailAdapter: {
	 	module: '@parse/simple-mailgun-adapter',
	 	options: {
			fromAddress: process.env.EMAIL_FROM || "no-reply@unimarkit.com",
	   		domain: process.env.MAILGUN_DOMAIN || "unimarkit.com",
	  		apiKey: process.env.MAILGUN_API_KEY  || "apikey",
	 	}
	 },

	//**** File Storage ****//
	 filesAdapter: new S3Adapter(
	 	{
	 		directAccess: true
	 	}
	 )
});

console.log(api);
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'myMasterKey')
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse' 
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Success');
});

app.get('/refer/:id', function(req, res) {
	const Gold = Parse.Object.extend("Gold");
	const query = new Parse.Query(Gold);
	query.equalTo("userID", req.params.id);
	console.log(req.params.id);
	query.first().then((goldStatus) => {
		console.log(goldStatus.get("totalReferralsMade"))
		goldStatus.set(1)
	    goldStatus.save()
		res.redirect(301, 'https://itunes.apple.com/us/app/unimarkit/id1377345929?mt=8');
	}, (error) => {
		console.log(error);
		console.log("logged error")
		res.redirect(404, 'https://itunes.apple.com/us/app/unimarkit/id1377345929?mt=8');
	});
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
