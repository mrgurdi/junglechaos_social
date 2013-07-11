
var Game = Class.$extend({
	__init__ : function(canvasId)
	{
		this.canvas = document.getElementById(canvasId);
		this.stage = new createjs.Stage(this.canvas);
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		createjs.Ticker.addListener(this);
		createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);
		createjs.Touch.enable(this.stage);

		this.scene = null;

		var that = this
		document.addEventListener("keydown", function(e){
			that.scene.keyPress();
		});
	},

	tick: function(elapsedTime)
	{
		if(this.scene != null)
			this.scene.update(elapsedTime);
		
		this.stage.update();
	},

	changeScene : function(scene)
	{
		this.stage.removeAllChildren();
		this.scene = scene;
		this.stage.addChild(scene.getInstance());
	}
});