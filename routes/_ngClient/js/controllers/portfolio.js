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

  
  // Fetch Collection from the DB using portfolio.service
  $scope.allStocks = portfolioService.get()
    .then(result => {
      $scope.appData = result;
      $scope.allStocks = result.symbols; // extract the array of stocks
      sumQuantity();
    })
    .catch(error => {
      $scope.allStocks = {}; // assume no data
    });

  $scope.currentPrices = [];    

  $scope.message = '';
  $scope.error = false;

  // This will calculate gains from all stockSymbols
  $scope.calculateTotalGain = function(symbols){
    
    var totalGain = 0;
    for (key in symbols){
      if (symbols[key].cpps!=null)
      totalGain += parseFloat($scope.calculateGainAll(symbols[key]));
    }
    return totalGain.toFixed(2);
  }
    
  $scope.calculateGainAll = function(symbol){
    var totalGain = 0;
    for (i = 0; i < symbol.held.length; i++){
      totalGain = totalGain + parseFloat($scope.calculateGain(symbol.held[i],symbol));
    }
    return totalGain.toFixed(2);
  };


// calculate purchase price
  $scope.calculateTotalpurchasePrice = function(symbols){
    var totalpurchaseprice = 0;
    for (key in symbols){
      if (symbols[key].cpps!=null)
      totalpurchaseprice += parseFloat($scope.calculateTotalpurchasePriceAll(symbols[key]));
    }
    return totalpurchaseprice.toFixed(2);
  }
    
  $scope.calculateTotalpurchasePriceAll = function(symbol){
    var totalpurchaseprice = 0;
    for (i = 0; i < symbol.held.length; i++){
      totalpurchaseprice = totalpurchaseprice + symbol.held[i].number * symbol.held[i].pps;
    }
    return totalpurchaseprice.toFixed(2);
  };

  // Calculate Gross price for overall table
  $scope.calculateTotalGrossPrice = function(symbols){
    var totalgrossprice = 0;
    for (key in symbols){
      if (symbols[key].cpps!=null)
      totalgrossprice += parseFloat($scope.calculateGrossPrice(symbols[key]));
    }
    totalgrossprice += $scope.appData.cash;
    return totalgrossprice.toFixed(2);
  }
    
  
 
  $scope.calculateGrossPrice = function(symbol){
    var totalGrossPrice = 0;
    for (i = 0; i < symbol.held.length; i++){
      totalGrossPrice = totalGrossPrice + symbol.held[i].number * symbol.cpps;
    }
    return totalGrossPrice.toFixed(2);
  };





// This will calculate global Sell Cost for all symbols

$scope.calculateTotalSellCost = function(symbols){
var totalSellCost = 0;
for (key in symbols){
if (symbols[key].cpps!=null)

totalSellCost += parseFloat($scope.calculateSellCostAll(symbols[key]));
}
return totalSellCost.toFixed(2);

}


// Calculate Total Sell Cost

$scope.calculateSellCostAll = function(symbol){
var totalSellCost = 0;
for (i = 0; i < symbol.held.length; i++){
var holding =
symbol.held[i];
totalSellCost += parseFloat($scope.calculateSellCost(holding, symbol));

}

return totalSellCost.toFixed(2);

};

// End test-DD

//Test2

$scope.calculateGPVAfterSellCost = function(symbols){
var gpv = parseFloat($scope.calculateTotalGrossPrice(symbols));
var tsc = parseFloat($scope.calculateTotalSellCost(symbols));

return (gpv - tsc).toFixed(2);

}
// calculating profit based on current and purchase prices


//Test2





  // These variable should be defined in the application config (init)
    // May be dynamically set during runtime
    var sellCostFixedH = 0.01; // 1% margin (High) for cost under 25k (sellCostFixedBracket)
    var sellCostFixedL = 0.005; // 0.5% margin (Low) for cost over 25k (sellCostFixedBracket)
    var sellCostFixedBracket = 25000;
    var sellCostAdditional = 1.25;
    


  $scope.calculateSellCost = function(record,symbol){
    var cpps = symbol.cpps;
    // below added due to NAN errors so decided to assign zero to null will do for all nulls that follow-DD
    if (cpps==null) cpps=0;
    var costTotal = record.number * cpps;
    var costHigh = 0;
    var costLow = 0;

    if (costTotal > sellCostFixedBracket){
      costLow = costTotal - sellCostFixedBracket;
      costHigh = sellCostFixedBracket;
    } else {
      costHigh = costTotal;
    }

    var cost = costLow * sellCostFixedL; //Calculating cost for upper-bracket
    cost += costHigh * sellCostFixedH; // Adding cost for lower-bracket;

    cost += sellCostAdditional; // Adding additional cost (fee)
    
    return cost.toFixed(2); // returning fixed float
  }

  $scope.calculateGain = function(record,symbol) {
    var cpps = symbol.cpps;
    if (cpps==null) cpps=0;
    
    var gain = record.number * (cpps - record.pps); // calculating profit based on current and purchase prices
    gain -= $scope.calculateSellCost(record,symbol); // correcting gain by adding selling cost
    return gain.toFixed(2); //returning fixed float
  }

  $scope.isProfitable = function(record,symbol){
    return $scope.calculateGain(record,symbol) > 0;
  }

  $scope.currentValue = function(record,symbol){
    var cpps = symbol.cpps;
    if (cpps==null) cpps=0;
  
  

    var result = cpps*record.number;
    return result.toFixed(2);
  }
  $scope.calculateGainPrc = function(record,symbol) {
    var percentage = $scope.calculateGain(record,symbol) / (record.number * record.pps);
    percentage *= 100;
    return percentage.toFixed(0); //returning float with no decimal
  }


  $scope.saveStocks = function() {
    console.log('$scope.allStocks', $scope.appData);
    portfolioService.set($scope.appData)
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