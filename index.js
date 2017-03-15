var express  = require('express'),
  bodyParser = require('body-parser'),
  app        = express(),
  path       = require('path'),
  CryptoJS   = require("crypto-js");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.json()); // create application/json parser
app.use(bodyParser.urlencoded({ entended: true })); //create application/x-www-urlencoded parser

var views = path.join(__dirname, 'public/views');

app.get('/', function (req, res) {
  res.sendFile(path.join(views, 'index.html'));
});

app.post('/', function (req, res) {
  var shared = "75d6a2f13b4c217910a96bae2dc4d2889870c6a8";
  var signed_req = req.body.signed_request;
  // split request at '.'
  var hashedContext = signed_req.split('.')[0];
  var context = signed_req.split('.')[1];
  // Sign hash with secret
  var hash = CryptoJS.HmacSHA256(context, shared); 
  // encrypt signed hash to base64
  var b64Hash = CryptoJS.enc.Base64.stringify(hash);
  if (hashedContext === b64Hash) {
   res.sendFile(path.join(views, 'index.html'));
  } else {
   res.send("authentication failed");
  }; 
})

var port = process.env.PORT || 9000;
app.listen(port);
console.log('Listening on port ' + port);
