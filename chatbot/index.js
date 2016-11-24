'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
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
            let text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

function sendTextMessage(sender, text) {
    //let messageData = { text:text }
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                {
                  "title":"Classic White T-Shirt",
                  "item_url":"https://petersfancyapparel.com/classic_white_tshirt",
                  "image_url":"https://petersfancyapparel.com/classic_white_tshirt.png",
                  "subtitle":"Soft white cotton t-shirt is back in style",
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"https://petersfancyapparel.com/classic_white_tshirt",
                      "title":"View Item",
                      "webview_height_ratio":"tall"
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

const token = "EAAE8weXTAi0BAL2MZAaG7wV0MEVD8w49bBvO6ql2OLZA1aB1SVeSntJ7vyOl7V5CAchAMGOXHKqIRvPVuYG6OvKiOSDsEZC7vJ7akCZBLXD2u9PjKEcsDPClQKqQdZAZCBCevubxLAdCaAUBD0GDD2qCUfChBhOp3mhvHKyTRJqQZDZD"

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})