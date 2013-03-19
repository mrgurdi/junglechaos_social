
var Loader = Class.$extend({
	__init__: function(debug){
		this.Loaded = 0;
		this.Total = 0;
		this.Debug = debug;
	},

	load: function(res,obj,func){
		this.Total = Object.keys(res).length;
		for(var key in res){
			if(res.hasOwnProperty(key)){
				var that = this;
				var image = new Image();
				image.onload = function(){
					that.Loaded++;
					that.log(that.Loaded+"/"+that.Total);

					if(that.Loaded == that.Total)
						func.call(obj);
				}
				image.src = res[key];
			}
		}
	},

	log: function(obj){
		if(this.Debug == true)
			console.log(obj);
	}
});