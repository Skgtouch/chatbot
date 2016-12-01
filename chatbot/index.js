'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const process = require('process');
const path    = require("path");

/*****Load JSON****/
const articles = require('./artical.json');
const menus = require('./menu.json'); /** Max 11 menus can be shown  **/
const response = require('./response.json');


const token = process.env.FB_PAGE_ACCESS_TOKEN;
app.set('port', (process.env.PORT || 5000))

console.log(path.resolve(__dirname+'/view/select.html'));
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot as')
})

app.get('/selectmenu', function (req, res) {
	res.sendFile(path.resolve(__dirname+'/view/select.html'));
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	console.log(req);
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
      if (event.message  && event.message.quick_reply) {  
          let payload = event.message.quick_reply.payload;
          let elements = articles[payload];
          sendMenuArticle(sender,elements);   
          continue
      }
      else if (event.message && event.message.text) {
	        let text = event.message.text;
	        if (text.match(/Hi|Hello|Hey|Heyy|Heyya/gi)) {
	        	sendMenuItems(sender);
	        	continue
	        }
	        else {
        		let generalText = getGeneralText(text);        
        		let responseDetails = response[generalText];
        		
		        if(responseDetails && responseDetails.type === 'text'){
		        	sendTextMessage(sender,responseDetails.print);
		        }else if (responseDetails && responseDetails.type === 'generic'){
		        	
		        }else {sendTextMessage(sender,"Sorry I couldn't hear you.Please be specific!!!");
		        }
	        }
       }

    }
    res.sendStatus(200)
  })

function sendMenuItems(sender) {
	let messageData = menus; 
	sendApi(sender,messageData)
}

// Menu Message 

function sendMenuArticle(sender,elements) {
    let messageData = {
    	    "attachment":{
    	        "type":"template",
    	        "payload":{
    	          "template_type":"generic",
    	          "elements":elements
    	        }
    	      }
    	    }
    
    sendApi(sender,messageData)
} 

/********End MEnu***********/


function sendTextMessage(sender, text) {
    let messageData = { text:text }        
    sendApi(sender,messageData);
}


function getGeneralText(text){
	let result;
	if(text.match(/How are you |How you doing /gi)){
		result = 'asking';
	}else{
		result = 'greeting'
	}
	
	return result;
	
}


/***** Call send API ******/

function sendApi(sender,messageData){
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