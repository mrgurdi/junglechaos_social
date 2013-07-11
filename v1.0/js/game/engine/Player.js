
var Player = Class.$extend({
	__init__:function(gravity)
	{
		this.player = new createjs.Container();
		this.gravity = gravity || -10;

		this.Velocity = {
			x : 0,
			y : 0
		};

		this.Jump = 0;
		this.Falling = true;
		this.Invincible = false;
	},

	getInstance: function()
	{
		return this.player;
	},

	goInvincible: function()
	{
		if(this.Invincible == false)
		{
			this.Invincible = true;
			this.player.alpha = 0.6;

			var that = this;
			setTimeout(function(){
				that.player.alpha = 1;
				that.Invincible = false;
			}, 10000);
		}
	},

	create:function(data,x,y)
	{
		this.data = data;

		this.SpriteSheet = new createjs.SpriteSheet(data);
		this.Animation = new createjs.BitmapAnimation(this.SpriteSheet);
		this.Animation.x = x;
		this.Animation.y = y;

		this.w = data.frames.width;
		this.h = data.frames.height;

		this.player.addChild(this.Animation);
	},

	jump:function(distance)
	{
		this.jump = distance;
	},

	setAnimation:function(index)
	{
		this.Animation.gotoAndPlay(index);
	},

	setPosition:function(x,y)
	{
		this.Animation.x = x;
		this.Animation.y = y;
	},

	setPositionX:function(x)
	{
		this.Animation.x = x;
	},

	setPositionY:function(y)
	{
		this.Animation.y = y;
	},

	setVelocity:function(x,y)
	{
		this.Velocity.x = x;
		this.Velocity.y = y;
	},

	addVelocity:function(x,y)
	{
		this.Velocity.x += x;
		this.Velocity.y += y;
	},

	update: function(elapsedTime)
	{
		this.Animation.x += this.Velocity.x * elapsedTime/1000;
		this.Animation.y += this.Velocity.y * elapsedTime/1000;
	},

	getPosition: function()
	{
		return {x: this.Animation.x, y: this.Animation.y};
	},

	getVelocity: function()
	{
		return {x: this.Velocity.x, y: this.Velocity.y};
	},

	getSize: function()
	{
		return {x: this.w, y:this.h};
	}
});