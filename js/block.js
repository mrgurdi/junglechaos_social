
var Block = Class.$extend({
	__init__: function(stage,src,x,y,width,height){
		this.Stage = stage;
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
		this.Image = new createjs.Bitmap(src);
		this.Image.x = this.X;
		this.Image.y = this.Y;
		this.Stage.addChild(this.Image);
	},

	setPos: function(x,y){
		this.X = x;
		this.Y = y;
		this.Image.x = this.X;
		this.Image.y = this.Y;
	},

	checkCollision: function(x,y,w,h){
		if(this.X > x+w 
			|| this.X + this.Width < x
			|| this.Y > y+h
			|| this.Y + this.Height < y)
			return false;

		return true;
	}
});