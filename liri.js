
var fs = require('fs');
var request = require('request');
var spotify = require('spotify');
var Twitter = require('twitter');

var action = process.argv[2];
var value = process.argv[3];

var pick = function(caseData, functionData){

	switch(caseData){

		case 'my-tweets':
			myTweets();
		break;

		case 'spotify-this-song':
			spotifyThisSong(functionData);
		break;

		case 'movie-this':
			movieThis(functionData);
		break;

		case 'do-what-it-says':
			doWhatItSays();
		break;

		default:
			console.log('You are NOT valid...Please try again');

	}
}

// TWITTER FUNCTION

function myTweets(){

	var twitterKeys = require('./keys.js').twitterKeys;

	// console.log(twitterKeys)

	var client = new Twitter(twitterKeys);

	var params = {screen_name: 'mholsapple80', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {

        for(var i = 0; i < 5; i++){
	        tweetText = tweets[i].text;
	        tweetTime = tweets[i].created_at;

	        console.log(tweetText + " Posted at " + tweetTime);
  		}
	  }
	})  

};

// SPOTIFY FUNCTION

function spotifyThisSong(songParam) {

	if (songParam == undefined){

		songParam = "Pillowtalk";
	}

	//console.log(songParam);

	spotify.search({ type: 'track', query:songParam}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }

	    else{
	    	console.log("Artist: " + data.tracks.items[0].artists[0].name);
	    	console.log("Song Name: " + data.tracks.items[0].name);
	    	console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url);
	    	console.log("Album: " + data.tracks.items[0].album.name);
	    }
	}); 
};



// MOVIE FUNCTION

function movieThis (movieParam){
	
	// DEFAULT MOVIE TITLE

	if (movieParam == undefined){

		movieParam = "Ever After";
	}

	var queryUrl = 'http://www.omdbapi.com/?t=' + movieParam + '&y=&plot=short&tomatoes=true&r=json';

	request(queryUrl, function(error, response, body) {

		if(!error && response.statusCode == 200) {

			var jsonPar = JSON.parse(body);

		// console.log(jsonPar);

			console.log("Movie Title: " + jsonPar.Title);
			console.log("Year Released: " + jsonPar.Year);
			console.log("IMDB Rating: " + jsonPar.imdbRating);
			console.log("Country Produced: " + jsonPar.Country);
			console.log("Language: " + jsonPar.Language);
			console.log("Plot: " + jsonPar.Plot);
			console.log("Actors: " + jsonPar.Actors);
			console.log("Rotten Tomatoes Rating: " + jsonPar.tomatoRating);
			console.log("Rotten Tomatoes URL: " + jsonPar.tomatoURL);
		}
	});
};


function doWhatItSays () {

	fs.readFile('random.txt', 'utf8', function(error, data) {

		if (!error) {

			var dataArray = data.split(',');
			console.log(dataArray);

			action = dataArray[0];

			if (action == "my-tweets") {
				pick(action, value);
			}
			else {
				value = dataArray[1];
				pick(action, value);
			}
		}
	});
};


pick(action, value);
