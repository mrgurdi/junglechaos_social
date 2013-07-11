
var App42_Score_Board;
var APP42_INITIALISED = false;;

var App42Lib = {
	init: function(akey, skey)
	{
		if(APP42_INITIALISED == false)
		{
			App42.initialize(akey, skey);
			App42_Score_Board = new App42ScoreBoard();
			APP42_INITIALISED = true;
		}
	},

	saveScore: function(name, score)
	{
		App42_Score_Board.saveUserScore("JungleChaos",name,Math.floor(score), {
			success: function(obj){
				console.log("Scored saved");
			},
			error: function(obj){
				console.log("Error saving scores");
			}
		});
	},

	getTopRankings: function(func){
		App42_Score_Board.getTopNRankers("JungleChaos",10,{
			success: function(obj){
				func(obj);
			},
			error: function(obj){
				console.log("Error retrieving scores");
			}
		});
	}
}