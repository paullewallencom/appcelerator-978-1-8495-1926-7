var PreferenceService = function() {
}

PreferenceService.prototype.getObjective = function() {
	return Ti.App.Properties.getInt('objective', 1);
}

PreferenceService.prototype.saveObjective = function(value) {
	Ti.App.Properties.setInt('objective', value);
}

PreferenceService.prototype.updateStock = function(updatedStock) {
	var allStocks = getStocks();
	
	// We loop through all stocks in order to find the one to update 
	for (var i=0; i < allStocks.length; i++) {
		if (allStocks[i].symbol === updatedStock.symbol) {
			// We found it!
			allStocks[i] = updatedStock;
		} 
	}
	saveStocks(allStocks);
}

PreferenceService.prototype.getPortfolioValue = function() {
	return Ti.App.Properties.getInt('portfolioValue', 0);
} 

var getStocks = function() {
	Ti.API.info(JSON.stringify(Ti.App.Properties.getList('stocks', [])));
		
	return Ti.App.Properties.getList('stocks', []);
};

var saveStocks = function(list) {
	Ti.API.info('Stocks saved');            
	
	Ti.App.Properties.setList('stocks', list);
	updatePortfolioValue(list);
};

PreferenceService.prototype.saveStocks = saveStocks;
PreferenceService.prototype.getStocks = getStocks;

// Calculate and store Portfolio Value
function updatePortfolioValue(stocks) {
	var totalValue = 0.00;
	
	for (var i=0; i < stocks.length; i++) {
		var s = stocks[i];
		
		totalValue += (s.price * s.quantity);
	}
	
	Ti.App.Properties.setInt('portfolioValue', totalValue);
}

var pref = new PreferenceService();
module.exports = pref;
