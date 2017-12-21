//require modules
var Pusher = require('pusher')
var credentials = require('./cred')
var africastalking = require('africastalking')(credentials.AT)
var cors = require('cors')
var bodyParser = require('body-parser')
// var Webtask = require('webtask-tools')

//configure modules
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
var webURL = 'http://foodigo.com/menu'
var welcomeMsg = `CON Hello and welcome to Foodigo.
Have your food delivered to you fast and hot!
Please find our menu ${webURL}
Enter your name to continue`

var orderDetails = {
    name: "",
    description: "",
    address: "",
    telephone: "",
    open: true
}
var lastData = "";

app.post('/order', function(req, res){
    console.log(req.body);
    var message = 'Hello' 

    var sessionId = req.body.sessionId
    var serviceCode = req.body.serviceCode
    var phoneNumber = req.body.phoneNumber
    var text = req.body.text
    var textValue = text.split('*').length

    if(text === ''){
        message = welcomeMsg
    }else if(textValue === 1){
        message = "CON What do you want to eat?"
        orderDetails.name = text;
    }else if(textValue === 2){
        message = "CON Where do we deliver it?"
        orderDetails.description = text.split('*')[1];
    }else if(textValue === 3){
        message = "CON What's your telephone number?"
        orderDetails.address = text.split('*')[2];
    }else if(textValue === 4){
        message = `CON Would you like to place this order?
        1. Yes
        2. No`
        lastData = text.split('*')[3];
    }else{
        message = `END Thanks for your order
        Enjoy your meal in advance`
        orderDetails.telephone = lastData   
    }
    
    res.contentType('text/plain');
    res.send(message, 200);

    console.log(orderDetails)
    if(orderDetails.name != "" && orderDetails.address != '' && orderDetails.description != '' && orderDetails.telephone != ''){
        pusher.trigger('orders', 'customerOrder', orderDetails)
    }
    if(orderDetails.telephone != ''){
        //reset data
    orderDetails.name= ""
    orderDetails.description= ""
    orderDetails.address= ""
    orderDetails.telephone= ""
    }

})
//listen on port 
app.listen(port, function(err, res){
    if(err) throw err
    console.log("Booming on the legendary port " + port)
})

