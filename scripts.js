// 1. Make JSON into a function so you can call it whenever you need to.  //DONE
// 2. Instead of auto saving their symbols, you give them a save button.  //DONE
// 3. Retrieve button?  //DONE
// 4. Put bookmarks on the side of page 2.
// 5. Automatically refresh all stocks every x seconds. //attempted
// 6. Keep the watchlist stocks in a separate table from searched stocks.
// 7. Keep a "recent" localStorage var, and a "saved" localStorage var
// 8. Pair up with Blackjack somehow

//wait for the DOM!!!
$(document).ready(function() {

	//set timer to refresh stock values on page load
	// setInterval(function() {
	// 	$('#stock-body').load(ajaxRequest)}, 2000);

	//all stocks searched for by user 
	var searchedStocks = [];

	$('#arrow1').click(function() {
		$('#page1,#page2').css({
			'right': '100vw'
		})
	});

	$('#arrow2').click(function() {
		$('#page1,#page2').css({
			'right': '0vw'
		})
	});

// See if the user has any stored stocks.  If so, load them.
	var userStocksSaved = localStorage.getItem('userStocks');
	$('.btn-warning').click(function() { //retrieves localStorage items upon clicking "Retrieve"
		ajaxRequest(userStocksSaved);
		searchedStocks.push(userStocksSaved);  //pushes previous search onto searchedStocks
	});


	$('.yahoo-form').submit(function() {

		// Stop the form from submitting (default action)
		event.preventDefault();

		//get whatever the user typed out of the input and store it in symbol
		var symbol = $('#symbol').val(); //gets the value of the symbol input on enter or click

		//pushes current search onto searchedStocks array in case they decide to save later
		searchedStocks.push(symbol);

		ajaxRequest(symbol);

	 });

	//allows user to save all items on the page
	$('.btn-success').click(function() {
		console.log('test');
		//localStorage takes two parameters - a new variable and what to set it to
		localStorage.setItem("userStocks", searchedStocks);
	})




	function ajaxRequest(value) {

	//dynamically build the URL to use the input the user made or stored in localStorage - needs to change depending on user input
	var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'+value+'")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json'; 

	// AJAX request - takes two params (where to go for info, what to do with the info when it returns)
	$.getJSON(url, function(data) { //when response comes back from URL, the function fires
		var stock = data.query.results.quote; //quote property is an object
			if (data.query.count == 1) { //want to see if 1 item was returned (not an object here)
				buildStockRow(stock);
			}

			else {
				for (var i = 0; i < stock.length; i++) { //for each object within stock (this assumes that input > 1), then need to loop through the array of objects input by user

					//if there's > 1 input, for each object within stockInfo, pass each individual object to the buildStockRow() function
					buildStockRow(stock[i]); //loop through stock and build HTML for each row
				}
			
			}
		})
	};


	function buildStockRow(stockInfo) {
		// check to see if change is + or -
		if (stockInfo.Change.indexOf('+') > -1) {  //change is a property of stockInfo
			// if > -1, there is a + somewhere in this string
			var classChange = "success";
		}
		else {
			var classChange = "danger";
		}

		//building new HTML 
		var newHTML = '';
		newHTML += '<tr>'; //targeting entire table body
			newHTML += '<td>'+stockInfo.Symbol+ '</td>';
			newHTML += '<td>'+stockInfo.Name+'</td>';
			newHTML += '<td>'+stockInfo.Ask+'</td>';
			newHTML += '<td>'+stockInfo.Bid+'</td>';
			newHTML += '<td class="'+classChange+'">'+stockInfo.Change+'</td>';
		newHTML += '</tr>';
		$('#stock-body').append(newHTML);  //change HTML from what's currently there to what we just constructed above (based on what was inside of stockInfo, which is what we pulled back from AJAX method);
		}

});


