
var ParallaxBG = Class.$extend({
	__init__:function(img1,img2,speed1,speed2,iw,iw2,x,y,w,h)
	{
		this.bg1 = new createjs.Container();
		this.bg2 = new createjs.Container();
		
		this.img1w = iw;
		this.img2w = iw2;
		for(i=0; i < w+iw; i+=iw)
		{
			img = new createjs.Bitmap(img1);
			img.y = 0;
			img.x = i;
			this.bg1.addChild(img);
		}

		for(i=0; i < w+iw2; i+=iw2)
		{
			img = new createjs.Bitmap(img2);
			img.y = 0;
			img.x = i;
			this.bg2.addChild(img);
		}

		this.speed1 = speed1;
		this.speed2 = speed2;

		this.bg = new createjs.Container();
		this.bg.x = x;
		this.bg.y = y;
		this.bg.addChild(this.bg1);
		this.bg.addChild(this.bg2);
	},

	getBG : function()
	{
		return this.bg;
	},

	update: function(elapsedTime)
	{
		this.bg1.x -= this.speed1 * elapsedTime/1000;
		if(this.bg1.x < (-1)*this.img1w)
			this.bg1.x = 0;

		this.bg2.x -= this.speed2 * elapsedTime/1000;
		if(this.bg2.x < (-1)*this.img2w)
			this.bg2.x = 0;	
	}
});