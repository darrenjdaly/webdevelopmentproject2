var express = require('express');
var path = require('path');
var fs = require('fs'); // for loading localhost test certs
var os = require('os');
var https = require('https');
var http = require('http');

var platform = require('./node_server/platform.js').configure();

var bodyParser = require('body-parser');
var logger = require('morgan');
var portfolio = require('./routes/portfolio');
var mongoDB_Service = require('./node_server/mongodb_service');
var mDBStr = require('./secrets.js').mongodb.connectionStr();
mongoDB_Service.connect(mDBStr).then(client => {
    console.log('connected to ' + mDBStr)
  })
  .catch(error => {
    console.log('connection error to ' + mDBStr);
  });

var app = express();
app.enable('trust proxy'); // needed for req.secure for bluemix

app.use(bodyParser.urlencoded({
  'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));
app.use(logger('dev')); // log every request to the console

app.use(function(req, res, next) { // req.protocol
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else { // request was via http, so redirect to https
    console.log("redirecting from http to https");
    console.log('https://' + req.headers.host + req.url);
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.use("/",
  express.static(__dirname + '/_ngClient')
);

app.use( // alias to third party js code etc
  "/js_thirdparty", //the URL throught which you want to access   content
  express.static(__dirname + '/js_thirdparty')
);
app.use( //  alias mapping
  "/node_modules", //the URL throught which you want to access   content
  express.static(__dirname + '/node_modules')
);
/*
app.use( // alias to third party js code manged by bower
			"/bower_components", //the URL throught which you want to access   content
			express.static(__dirname + '/bower_components')
);
 */
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/_ngClient/index.html'));
});

// all the server rest type route paths are mapped in index.js
app.use('/', require('./routes')); // will load/use index.js by default from this folder

app.use('/api/v1/portfolio', portfolio);


app.use(function(req, res, next) { // If no route is matched by now, it must be a 404
  console.log(
    "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  );
  var err = new Error(
    'Route Not Found, are you using the correct http verb / is it defined?\n\n' +
    req.method + "\t" + req.path + "\n\n");
  err.status = 404;
  next(err);
});


if (platform.isLocalHost) { //was cfCore.isLocal
  // openssl genrsa -out test-key.pem 1024
  // openssl req -new -key test-key.pem -out certrequest.csr
  // openssl x509 -req -in certrequest.csr -signkey test-key.pem -out test-cert.pem
  console.log("*** Using temp SSL keys on the nodejs server");
  var privateKey = fs.readFileSync('ssl/test-key.pem');
  var certificate = fs.readFileSync('ssl/test-cert.pem');

  var localCertOptions = { // use local self-signed cert
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false
  };

  https.createServer(localCertOptions, app).listen(platform.port, function() {
    console.log(new Date().toISOString());
    console.log(__dirname + '/_ngClient');
  });

} else { // not local, its in the cloud somewhere, assuming cloud provides ssl certs

  if (platform.architecture === "bluemix") // could refactor next 2, leaving separate incase needed in future
  {
    app.listen(platform.port, function() {
      console.log(platform.architecture + ' server startup port: ' +
        platform.port);
    });
  } else
  if (platform.architecture === "heroku") {
    app.listen(platform.port, function() {
      console.log(platform.architecture + ' server startup port: ' +
        platform.port);
    });
  }
}
