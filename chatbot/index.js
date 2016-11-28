'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const process = require('process');
const path    = require("path");

const token = process.env.FB_PAGE_ACCESS_TOKEN;
app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/View'));
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

app.get('/selectmenu', function (req, res) {
	res.sendFile('select.html');
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text;

        if (text === 'Menu') {
        	sendMenuItem(sender);
            continue
        }
        
        if (text.match(/Hi|Hello|Hey|Heyy|Heyya/gi)) {
        	//sendTextMessage(sender, "Hello, How can I help you? Please select the menu!!!");
			sendGenericMessage(sender);
            continue
        }
        
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendMenuItem(sender, token);
        continue
      }
    }
    res.sendStatus(200)
  })

function sendGenericMessage(sender) {
    let messageData = {
    		    "attachment":{
    		      "type":"template",
    		      "payload":{
    		        "template_type":"button",
    		        "text":"Hello, How can I help you? Please select the menu!!! ",
    		        "buttons":[
    		          {
    		        	  "type":"web_url",
    		              "url":"https://skgtouch.herokuapp.com/selectmenu",
    		              "title":"Select Criteria",
    		              "webview_height_ratio": "compact"
    		          }
    		        ]
    		      }
    		    }
    		  }
    
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
            setting_type : "domain_whitelisting",
            whitelisted_domains : ["https://skgtouch.herokuapp.com"],
            domain_action_type: "add"
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Menu Message 

function sendMenuItem(sender) {
    let messageData = { text:"Success" }
            
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
} 

/********End MEnu***********/


function sendTextMessage(sender, text) {
    let messageData = { text:text }
            
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})