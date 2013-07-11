
var Background = Class.$extend({
	Speed: 100,

	__init__: function(container,img_src,img_width,img_height,width,height,x,y){
		this.outerContainer = container;
		this.Container = new createjs.Container();
		this.ImageSrc = img_src;
		this.ImageWidth = img_width;
		this.ImageHeight = img_height;
		this.Width = width;
		this.Height = height;

		this.Container.x = x || 0;
		this.Container.y = y || 0;
		for(i=0; i<this.Width+this.ImageWidth; i+=this.ImageWidth){
			img = new createjs.Bitmap(this.ImageSrc);
			img.x = i;
			img.y = 0-(this.ImageHeight-this.Height);
			this.Container.addChild(img);
		}
		this.outerContainer.addChild(this.Container);
	},

	tick: function(elapsedTime){
		this.Container.x -= elapsedTime/1000 * this.Speed;
		if(this.Container.x < (-1)*this.ImageWidth){
			this.Container.x = 0;
		}
	}
});