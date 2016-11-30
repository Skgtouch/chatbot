'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const process = require('process');
const path    = require("path");

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
        
        if (text.match(/Hi|Hello|Hey|Heyy|Heyya/gi)) {
        	//sendTextMessage(sender, "Hello, How can I help you? Please select the menu!!!");
			sendGenericMessage(sender);
            continue
        }
        
      }
      if (event.postback  && event.postback.payload) {
        let text = event.postback.payload;
        switch(text)
         {
         case 'seafood' : sendTextMessage(sender,text);
         break;
         
         default:  sendTextMessage(sender,'default');
         }
        
        continue
      }
    }
    res.sendStatus(200)
  })

function sendGenericMessage(sender) {
/*    let messageData = {
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
    		  }*/
	
	let messageData = {
		    "text":"Pick a menu:",
		    "quick_replies":[
		      {
		        "content_type":"text",
		        "title":"Baking",
		        "payload":"baking"
		      },
		      {
		        "content_type":"text",
		        "title":"Desert",
		        "payload":"desert"
		      },
		      {
			        "content_type":"text",
			        "title":"Meat",
			        "payload":"meat"
			  },
		      {
			   "content_type":"text",
			    "title":"Seafood",
			    "payload":"seafood"
			   },
			   {
			   "content_type":"text",
			    "title":"Inspiration",
			    "payload":"inspiration"
			   }
			        
		    ]
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
    let messageData = {
    	    "attachment":{
    	        "type":"template",
    	        "payload":{
    	          "template_type":"generic",
    	          "elements":[
    	            {
    	              "title":"Pasta with Monkfish & Mussels",
    	              "item_url":"http://www.aol.co.uk/living/food/pasta-with-monkfish-and-mussels/121/",
    	              "image_url":"http://o.aolcdn.com/os/ukmedia/aoluk/recipes/Recipe_121.jpg",
    	              "subtitle":"We\'ve got the this for everyone.",
    	              "buttons":[
    	                {
    	                  "type":"web_url",
    	                  "url":"http://www.aol.co.uk/living/food/pasta-with-monkfish-and-mussels/121/",
    	                  "title":"View Website"
    	                },
    	                {
    	                  "type":"postback",
    	                  "title":"Start Chatting",
    	                  "payload":"need more menu"
    	                }              
    	              ]
    	            },
    	            {
      	              "title":"Pasta with Monkfish & Mussels",
      	              "item_url":"http://www.aol.co.uk/living/food/pasta-with-monkfish-and-mussels/121/",
      	              "image_url":"http://o.aolcdn.com/os/ukmedia/aoluk/recipes/Recipe_121.jpg",
      	              "subtitle":"We\'ve got the this for everyone.",
      	              "buttons":[
      	                {
      	                  "type":"web_url",
      	                  "url":"http://www.aol.co.uk/living/food/pasta-with-monkfish-and-mussels/121/",
      	                  "title":"View Website"
      	                },
      	                {
      	                  "type":"postback",
      	                  "title":"Start Chatting",
      	                  "payload":"need more menu"
      	                }              
      	              ]
      	            },
    	            {
      	              "title":"Pasta with Monkfish & Mussels",
      	              "item_url":"http://www.aol.co.uk/living/food/pasta-with-monkfish-and-mussels/121/",
      	              "image_url":"http://o.aolcdn.com/os/ukmedia/aoluk/recipes/Recipe_121.jpg",
      	              "subtitle":"We\'ve got the this for everyone.",
      	              "buttons":[
      	                {
      	                  "type":"web_url",
      	                  "url":"http://www.aol.co.uk/living/food/pasta-with-monkfish-and-mussels/121/",
      	                  "title":"View Website"
      	                },
      	                {
      	                  "type":"postback",
      	                  "title":"Start Chatting",
      	                  "payload":"need more menu"
      	                }              
      	              ]
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