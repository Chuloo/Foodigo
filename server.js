//require modules
var Pusher = require('pusher')
var credentials = require('./cred')
var africastalking = require('africastalking')(credentials.AT)
var cors = require('cors')
var bodyParser = require('body-parser')
var Webtask = require('webtask-tools')

//configure modules
var sms = africastalking.SMS
var voice = africastalking.VOICE
var express = require('express')
var app = express()
var port = 3000
var path = require('path')

var pusher = new Pusher(credentials.pusher)
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Serve home page and static files
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + "/index.html"))
})
app.use(express.static(__dirname + '/'))

//configure AT
var webURL = 'http://tummytime.com/menu'
var welcomeMsg = `CON Hello and welcome to TummyTime. 
Have your food delivered to you fast and hot!
Please find our menu ${webURL}
Enter your name to continue`
var orderDetails = {
    name: "",
    description: "",
    address: "",
    telephone: ""
}

app.post('/order', function(req, res){
    console.log(req.body);
    var message = '' 

    var sessionId = req.body.sessionId
    var serviceCode = req.body.serviceCode
    var phoneNumber = req.body.phoneNumber
    var text = req.body.text
    var textValue = text.split('*').length

    console.log(sessionID, serviceCode, phoneNumber, text)

    if(text === ''){
        message = welcomeMsg
    }else if(textValue){
        message = "What do you want to eat?"
        name = text;
    }else if(textValue){
        message = "Where do we deliver it?"
        description = text;
    }else if(textValue){
        message = "what's your telephone number?"
        address = text;
    }else if(textValue){
        message = `Would you like to place this order?
        1. Yes
        2. No`
        telephone = text;
    }else if(text === '1'){
        message = `END Thanks for your order
        Enjoy your meal in advance`
    }else{
        message = `END We are sorry you are cancelling your order
        You can always restart whenever you choose
        Call us on 08140146714 for any assistance`
    }

    //configure pusher
    pusher.trigger('orders', 'customerOrder', orderDetails) 

})
//listen on port 
app.listen(port, function(err, res){
    if(err) throw err
    console.log("Listening on port " + port)
})

