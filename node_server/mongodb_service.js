var MongoClient = require('mongodb').MongoClient // mongodb": "^3.0.1
// rlacey2@gmail.com modified for future scaling to multipe connections
//var ObjectID = require('mongodb').ObjectID;          // NB
var Q = require('q'); // promises
var state = {
  client: null,
  dbs: {}
  //collections : {}
}

mongodbService = { // returns a promise

  connect: function(url) {
    // technical debt cache different url clients, currently assuming single mongodb connection/address
    var deferred = Q.defer();
    if (state.client) return deferred.resolve(state.client);

    MongoClient.connect(url)
      .then(client => {
        state.client = client;
        return deferred.resolve(state.client);

      }).catch(error => {
        state.client = null;
        console.log(error);
        deferred.reject(error);
      })
    return deferred.promise;
  },


  client: function() {
    var deferred = Q.defer();
    if (state.client) {
      deferred.resolve(state.client);
    } else {
      deferred.resolve(undefined)
    }
    return deferred.promise;
  },

  getCollection: function(targetDB, targetCollection) {
    if (!state.dbs[targetDB]) {
      state.dbs[targetDB] = {
        db: null,
        collections: {}
      };
      state.dbs[targetDB].db = state.client.db(targetDB);
    }
    if (!state.dbs[targetDB].collections[targetCollection]) {
      state.dbs[targetDB].collections[targetCollection] = state.dbs[targetDB].db.collection(targetCollection);
    }
    return state.dbs[targetDB].collections[targetCollection];
  },

  close: function() {
    var deferred = Q.defer();
    if (state.client) {

      state.client.close()
        .then(deferred.resolve(true))
        .catch(error => {
          deferred.resolve(error)
        });
    } else {
      deferred.resolve(false)
    }
    return deferred.promise;
  }
};

module.exports = mongodbService;
