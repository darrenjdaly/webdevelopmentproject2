var express = require('express');
var router = express.Router(); // router functionality
var mongoDB_Service = require('../node_server/mongodb_service');
var ObjectID = require('mongodb').ObjectID; // NBNeeded

var Q = require('q'); // promises

// remember server.js consumes /api/v1/stocks/ part of the path before sending here
// this router handles from the last / i.e. route refactoring

var dbName = 'dbuser';
var collName = 'stocks';

router.get('/', function(req, res) { // return a set of stocks max 100
	console.warn("get /api/v1/porfolio");
	var result;
	var pageNumber = parseInt(req.query.pageNumber || 1);
	var nPerPage = parseInt(req.query.nPerPage || 100);
	var skipValue = pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0;
	//	console.log(pageNumber, nPerPage, skipValue);

	mongoDB_Service.client().then(client => client.db(dbName).collection(collName)
		.find().skip(skipValue).limit(nPerPage).toArray())
		.then(out => {
			res.status(200)
			res.json({
				pageNumber: pageNumber,
				nPerPage: nPerPage,
				stocks: out
			});
		})
		.catch(error => {
			//console.log(error)
			res.status(404)
			res.json({
				pageNumber: -1,
				nPerPage: -1,
				stocks: [],
				'error': error
			});
		});
});

router.post('/', function(req, res) { // return a set of stocks max 100
	console.log('res', req.body);
	mongoDB_Service.client().then(client => {
		client.db(dbName).collection(collName)
			.update({}, {$set: req.body}, { multi: true })
			.then(out => {
				res.status(200);
				res.json();
			})
			.catch(error => {
				//console.log(error)
				res.status(404);
				res.json();
			});
		});
});

module.exports = router;
