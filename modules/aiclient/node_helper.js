//node_helper.js

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		var self = this;
		var events = [];

		this.fetchers = [];

		console.log("Starting node helper for: " + this.name);

	    this.expressApp.get('/statement', function (req, res) {
	        text = req.query.text;
	        self.sendSocketNotification("STATEMENT", {"text":text})
	        res.sendStatus(200);
	    });

		this.expressApp.get('/menu', function (req, res) {
	        text = req.query.text;
	        self.sendSocketNotification("MENU", {})
	        res.sendStatus(200);
	    });

		this.expressApp.get('/chooseport', function (req, res) {
	        var id = req.query.id;
	        self.sendSocketNotification("CHOOSEPORT", {id: id});
	        res.sendStatus(200);
	    });

		this.expressApp.get('/shorex', function (req, res) {
	        text = req.query.text;
	        self.sendSocketNotification("SHOREX", {port:undefined})
	        res.sendStatus(200);
	    });

		this.expressApp.get('/beacon', function (req, res) {
	        //folio = req.query.folio
			distance = req.query.distance

	        self.sendSocketNotification("BEACON", {"distance": distance});
	        res.sendStatus(200);
	    });

	    this.expressApp.post('/image', function (req, res) {
	    	var data = "";
   			req.on('data', function(chunk){ data += chunk})
   			req.on('end', function(){
       			req.rawBody = data;
       			req.jsonBody = JSON.parse(data);
       			url = req.jsonBody.url
       			console.log(url)
	        	self.sendSocketNotification("IMAGE", {"imageurl":url})
	        	res.sendStatus(200);
   			})
	    });

	    this.expressApp.post('/weather', function (req, res) {
	        var data = "";
   			req.on('data', function(chunk){ data += chunk})
   			req.on('end', function(){
       			req.rawBody = data;
       			req.jsonBody = JSON.parse(data);
	        	self.sendSocketNotification("WEATHER", req.jsonBody)
	        	res.sendStatus(200);
   			})
	    });

	    this.expressApp.get('/face', function (req, res) {
	        self.sendSocketNotification("FACE", {})
	        res.sendStatus(200);
	    });

	    this.expressApp.post('/holidays', function (req, res) {
	        var data = "";
   			req.on('data', function(chunk){ data += chunk})
   			req.on('end', function(){
       			req.rawBody = data;
       			req.jsonBody = JSON.parse(data);
       			holiday = req.jsonBody.holiday
	        	self.sendSocketNotification("HOLIDAYS", {"holiday": holiday})
	        	res.sendStatus(200);
   			})
	    });

	    this.expressApp.post('/news', function (req, res) {
	       var data = "";
   			req.on('data', function(chunk){ data += chunk})
   			req.on('end', function(){
       			req.rawBody = data;
       			req.jsonBody = JSON.parse(data);
       			articles = req.jsonBody.articles
	        	self.sendSocketNotification("NEWS", {"articles":articles})
	        	res.sendStatus(200);
   			})
	    });

	    this.expressApp.get('/clear', function (req, res) {
	        text = req.query.text
	        self.sendSocketNotification("CLEAR", {})
	        res.sendStatus(200);
	    });




	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		console.log("helper received: " + notification);

		if (notification == "SPEAK") {
			var exec = require("child_process").exec;
			console.log(payload.text);
		//var source = spawn('python', ["source", "hhsmartmirror/bin/activate"]);
		var process = exec("cd /Users/jodybrewster/Projects/AI-Smart-Mirror/; source hhsmartmirror/bin/activate; python speech.py \"" + payload.text + "\"", function(err,stdout,strerr)
		{
			console.log(err); 
			console.log(strerr); 
			console.log(stdout); 
		});

		}
	}
})