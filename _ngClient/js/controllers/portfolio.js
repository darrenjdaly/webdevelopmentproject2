//controller for JSON models DD
angularnodeApp.controller('portfolioControler', ['$scope', 'portfolioService',
  function($scope, portfolioService) {

    function sumQuantity() //  this may not be the best place in the architecture for this code!
    {
      // for each stock holding, sum the total number of shares remaining
      // we have to access each stock and then process any of its held records and then store the total
      // back on the relevant portion of the structure, Object.keys will give a list of the keys = symbols.

      var stockSymbols = Object.keys($scope.allStocks);

      // iterate each stock
      var tempStock;
      stockSymbols.forEach(aStockSymbol => {
        // console.log(aStockSymbol)
        // get the data of aStockSymbol
        tempStock = $scope.allStocks[aStockSymbol]; // copy to tempStock so we can work on it
        var i;
        var qtyTotal = 0;
        for (i = 0; i < tempStock.held.length; i++) {
          // generate a value to go on each row for a stock entry
          tempStock.held[i].nowValue = (tempStock.held[i].number * tempStock.held[
            i].pps).toFixed(2);
          // generate a cumulative total to be used at the end of all the stock lines
          qtyTotal = qtyTotal + tempStock.held[i].number; // for the total row
        }
        // store the total back on the object to access in the html
        $scope.allStocks[aStockSymbol].totalQuantity = qtyTotal;
        //console.log(tempStock);
      });
    }

    $scope.allStocks = portfolioService.get()
      .then(result => {
        $scope.allStocks = result; // extract the array of stocks
        sumQuantity();
      })
      .catch(error => {
        $scope.allStocks = {}; // assume no data
      });

    $scope.message = '';
    $scope.error = false;
    $scope.saveStocks = function() {
      console.log('$scope.allStocks', $scope.allStocks);
      portfolioService.set($scope.allStocks)
        .then(result => {
          $scope.error = false;
          $scope.message = 'Porfolio has been updated';
        })
        .catch(error => {
          $scope.error = false;
          $scope.message = 'Porfolio did not update';
        });
    };
  }
]); // StockCtrl
