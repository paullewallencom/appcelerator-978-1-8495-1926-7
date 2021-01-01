var ps = require('service/PreferenceService');

function OnlineQuotesService() {
}

OnlineQuotesService.prototype.fetchValues = function() {
	var stockList = ps.getStocks();
	
	for (var i=0; i < stockList.length; i++) {
		var s = stockList[i];
		// Update the Latest Stock Price
		getLastPrice(s);
	}
}

function getLastPrice(stock) {
	var url = 'http://dev.markitondemand.com/Api/Quote/json?symbol=' + stock.symbol;
	
	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			// this function is called when data is returned from the server and available for use
			var quote = JSON.parse(this.responseText).Data;
			
			var newPrice = quote.LastPrice; 
			stock.price = Math.round(newPrice * 100) / 100;
			
			Ti.App.fireEvent('oqs:stockUpdated', stock);
		},
		onerror: function(e) {
			// this function is called when an error occurs, including a timeout
			Ti.API.error(e.error);
		},
		timeout: 5000  /* in milliseconds */
	});
	
	xhr.open("GET", url);
	xhr.send();  // request is actually sent with this statement
}

var service = new OnlineQuotesService();

module.exports = service;