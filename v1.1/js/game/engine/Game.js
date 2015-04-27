
var Game = Class.$extend({
	__init__ : function(canvasId)
	{
		this.canvas = document.getElementById(canvasId);
		this.stage = new createjs.Stage(this.canvas);
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		createjs.Ticker.game = this;
		createjs.Ticker.addEventListener("tick", this.tick);
		createjs.Ticker.framerate = 30;
		createjs.Touch.enable(this.stage);

		this.scene = null;

		var that = this
		document.addEventListener("keydown", function(e){
			that.scene.keyPress();
		});
	},

	tick: function(tickEvent)
	{
		//console.log(tickEvent);
		if(tickEvent.target.game.scene != null)
			tickEvent.target.game.scene.update(tickEvent.delta);
		
		tickEvent.target.game.stage.update();
	},

	changeScene : function(scene)
	{
		this.stage.removeAllChildren();
		this.scene = scene;
		this.stage.addChild(scene.getInstance());
	}
});