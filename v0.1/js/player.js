
var Player = Class.$extend({
	/*Position: {
		X: 0,
		Y: 0
	},
	Velocity: {
		X: 0,
		Y: 0
	},
	Size: {
		X: 0,
		Y: 0
	},
	Jump: 0,
	Fall: true,*/

	__init__: function(stage,data,x,y,width,height,id){
		this.Stage = stage;
		this.Data = data;
		this.SpriteSheet = new createjs.SpriteSheet(data);
		this.Animation = new createjs.BitmapAnimation(this.SpriteSheet);
		this.Animation.x = x;
		this.Animation.y = y;
		/*this.Position.X = x;
		this.Position.Y = y;
		this.Size.X = width;
		this.Size.Y = height;*/
		this.Position = {
			"X" : x || 0,
			"Y" : y || 0
		};
		this.Velocity = {
			"X" : 0,
			"Y" : 0
		};
		this.Size = {
			"X" : width || 0,
			"Y" : height || 0
		};
		this.Jump = 0;
		this.Fall = true;
		this.Stage.addChild(this.Animation);
		this.ID = id || (new Date()).getTime();
	},

	setPos: function(x,y){
		this.Position.X = x || 0;
		this.Position.Y = y || 0;
	},

	updtPos: function(){
		this.Animation.x = this.Position.X;
		this.Animation.y = this.Position.Y;
	},

	setVel: function(x,y){
		this.Velocity.X = x || 0;
		this.Velocity.Y = y || 0;
	},

	setAnimation: function(index){
		this.Animation.gotoAndPlay(index);
	},

	move: function(elapsedTime){
		var et = elapsedTime || 1000;
		this.Position.X += et/1000 * this.Velocity.X;	
		this.Position.Y += et/1000 * this.Velocity.Y;
		this.Animation.x = this.Position.X;
		this.Animation.y = this.Position.Y;	
	},

	checkCollison: function(x,y,w,h){
		if(this.Position.X > x+w 
			|| this.Position.X + this.Size.X < x
			|| this.Position.Y > y+h
			|| this.Position.Y + this.Size.Y < y)
			return false;

		return true;
	}
});