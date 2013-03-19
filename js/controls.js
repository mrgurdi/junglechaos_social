
var Button = Class.$extend({
	__init__: function(stage,src,x,y,obj,func){
		this.Stage = stage;
		this.Image_Src = src;
		this.Image = new createjs.Bitmap(this.Image_Src);
		this.Image.x = x;
		this.Image.y = y;
		this.Image.addEventListener("mousedown", function(evt){
			func.call(obj);
		});
		stage.addChild(this.Image);
	}
});

var Bitmap = Class.$extend({
	__init__: function(stage,src,x,y){
		this.Stage = stage;
		this.Image_Src = src;
		this.Image = new createjs.Bitmap(this.Image_Src);
		this.Image.x = x;
		this.Image.y = y;
		stage.addChild(this.Image);
	}
});

var Label = Class.$extend({
	__init__: function(stage,text,x,y,color,font){
		this.Stage = stage;
		this.Text = new createjs.Text(text,font || "34px Arial", color || "#000");
		this.Text.x = x;
		this.Text.y = y;
		this.Stage.addChild(this.Text);
	},

	setText: function(obj){
		this.Text.text = obj;
	}
});

var Container = Class.$extend({
	__init__: function(stage,x,y){
		this.Stage = stage;
		this.Container = new createjs.Container();
		this.Container.x = x;
		this.Container.y = y;
		this.Stage.addChild(this.Container);
	},

	addButton: function(src,x,y,obj,func){
		var btn = new Button(this.Container,src,x,y,obj,func);
		return btn;
	},

	addBitmap: function(src,x,y){
		var bmp = new Bitmap(this.Container,src,x,y);
		return bmp;
	},

	addLabel: function(text,x,y,color,font){
		var txt = new Label(this.Container,text,x,y,color,font);
		return txt;
	},

	removeChildren: function(){
		this.Container.removeAllChildren();
	}
});