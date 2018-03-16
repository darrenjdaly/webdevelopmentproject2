//service for JSON model DD
angularnodeApp.service('portfolioService', ['$http', function($http) {

  var angularnodeApp = angular.module("angularnodeApp");

  var routePrefix = '/api/v1/portfolio';

  var getAllStocks = function() {
    return $http.get(routePrefix).then(function(res) {
      console.log(res.data.stocks[0]);
      delete res.data.stocks[0]['_id'];
      delete res.data.stocks[0]['stocks'];
      return res.data.stocks[0];
    });
  }

  var setAllStocks = function(stockData) {
    return $http.post(routePrefix, stockData).then(function(res) {
      return true;
    });
  }

  return { // expose the service methods to consuming clients
    get: getAllStocks,
    set: setAllStocks,
  }

}]);
