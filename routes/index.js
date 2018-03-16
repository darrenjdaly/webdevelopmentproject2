// router to handle http paths

var express = require('express');

var router = express.Router();

// catch the routes here, samples provided, replace with your paths


router.get('/alpha', function(req, res) {
	res.status(200)
    res.json( { 'msg' : 'GET handler for alpha route.' } );
});

router.post('/alpha', function(req, res) {
	res.status(200)
    res.send({ 'msg' : 'POST handler for alpha route.'});
});

router.put('/alpha', function(req, res) {
	res.status(200)
    res.send({ 'msg' : 'PUT handler for alpha route.'});
});

router.delete('/alpha', function(req, res) {
	res.status(200)
    res.send({ 'msg' : 'Delete handler for alpha route.'});
});


 
module.exports = router; // finally export the router that handles the routes