
var PlayerType = {
	Local: 0,
	Remote: 1
};

var World = Class.$extend({
	Speed: 400,
	Debug: false,
	__init__: function(stage,x,y,debug,height,obj,func){
		this.Stage = stage;
		this.Container = new createjs.Container();
		this.Container.x = x || 0;
		this.Container.y = y || 0;
		this.Stage.addChild(this.Container);
		this.Blocks = new Array();
		this.Enemies = new Array();
		this.EnemiesMap = new Array();
		this.Map = new Array();
		this.Players = new Array();
		this.Debug = debug || false;

		this.Parent = obj;
		this.Death = func;
		this.Height = height;
	},

	addBlock: function(src,x,y,width,height){
		block = new Block(this.Container,src,x,y,width,height);
		this.Blocks.push(block);
		this.Map.push([x,y,"b"]);
	},

	addEnemy: function(src,x,y,width,height){
		enemy = new Block(this.Container,src,x,y,width,height);
		this.Blocks.push(enemy);
		this.Map.push([x,y,"e"]);
	},

	addPlayer: function(plyr, type){
		this.Players.push([plyr,type]);
		if(type == PlayerType.Remote && this.Players.length > 1){
			this.Container.swapChildren(plyr.Animation,this.Players[0][0].Animation)
		}
	},

	getPlayer: function(id){
		for(j=0; j<this.Players.length; j++){
			//this.log(this.Players[j][0].ID+"=>"+id);
			if(this.Players[j][0].ID == id){
				return this.Players[j][0];
			}
		}
	},

	removePlayer: function(id){
		for(j=0; j<this.Players.length; j++){
			//this.log(this.Players[j][0].ID+"=>"+id);
			if(this.Players[j][0].ID == id){
				//return this.Players[j][0];
				this.Players.splice(j,1);
			}
		}
	},

	tick: function(elapsedTime){
		this.Container.x -= elapsedTime/1000 * this.Speed;
		for(i=0;i<this.Blocks.length;i++){
			if(this.Container.localToGlobal(this.Blocks[i].X,this.Blocks[i].Y).x < -this.Blocks[i].Width){
				//this.log(i+":Old:"+this.Blocks[i].X+"x"+this.Blocks[i].Y);
				this.Blocks[i].setPos(this.Blocks[i].X += this.Map[this.Blocks.length-1][0],this.Blocks[i].Y);
				//this.log(i+":New:"+this.Blocks[i].X+"x"+this.Blocks[i].Y);
			}
		}
		//this.log("Total Players "+this.Players.length);
		for(j=this.Players.length-1; j>=0; j--){
			//this.log(j+":"+this.Players[j][0].Position.X+"x"+this.Players[j][0].Position.Y);
			/*if(this.Players[j][1] == PlayerType.Local){
				for(k=0; k<this.Players.length; k++){
					if(j != k){
						this.log(this.Players[k][0].ID+" => "+this.Players[j][0].Position.X-this.Players[k][0].Position.X);
					}
				}
			}*/
			var countx=0,county=0,rtest=0,rtest2=0;
			for(i=0;i<this.Blocks.length;i++){
				//if(this.Players[j][1] == PlayerType.Local){
					var tmpx = this.Players[j][0].Position.X + elapsedTime/1000 * this.Players[j][0].Velocity.X;	
					var tmpy = this.Players[j][0].Position.Y + elapsedTime/1000 * this.Players[j][0].Velocity.Y;

					if(this.Players[j][1] == PlayerType.Remote){
						if(this.Map[i][2] == "e"){
							var tmpx1 = this.Players[j][0].Position.X + this.Players[j][0].Size.X+10;
							var tmpy1 = this.Players[j][0].Position.Y;
						}
						else{
							var tmpx1 = this.Players[j][0].Position.X + this.Players[j][0].Size.X;
							var tmpy1 = this.Players[j][0].Position.Y + 10;
						}
						if(this.Blocks[i].checkCollision(tmpx1,tmpy1,this.Players[j][0].Size.X,this.Players[j][0].Size.Y) == true){
							rtest++;
							if(this.Map[i][2] == "e"){
								//if(this.Players[j][1] == PlayerType.Remote && this.Players[j][0].Fall == false){
								//	this.Players[j][0].Jump = -150;
								//}
								rtest2++;
							}
						}				
					}

					if(this.Blocks[i].checkCollision(tmpx,this.Players[j][0].Position.Y,this.Players[j][0].Size.X,this.Players[j][0].Size.Y) == true){
						countx++;
						if(this.Map[i][2] == "e" && this.Players[j][1] == PlayerType.Local){
							var that = this;
							//createjs.Tween.get(this.Players[j][0].Animation).to({alpha:0,y:0}, 500).call(function(){
									that.Death.call(that.Parent);
									break;
							//});
						}
					}

					if(this.Blocks[i].checkCollision(this.Players[j][0].Position.X,tmpy,this.Players[j][0].Size.X,this.Players[j][0].Size.Y) == true){
						county++;
						this.Players[j][0].Fall = false;
						/*if(this.Map[i][2] == "e" && this.Players[j][1] == PlayerType.Local){
								this.Death.call(this.Parent);
						}*/
					}
				//}
			}
			if(rtest <= 0 && this.Players[j][1] == PlayerType.Remote && this.Players[j][0].Fall == false){
				this.Players[j][0].Jump = -150;
			}
			if(rtest2 > 0 && this.Players[j][1] == PlayerType.Remote && this.Players[j][0].Fall == false){
				this.Players[j][0].Jump = -150;
			}
			if(countx <= 0 ){
				this.Players[j][0].Position.X += elapsedTime/1000 * this.Players[j][0].Velocity.X;
				this.Players[j][0].updtPos();
			}
			if(this.Players[j][0].Jump < 0){
				this.Players[j][0].Position.Y -= elapsedTime/1000 * this.Players[j][0].Velocity.Y;
				this.Players[j][0].Jump += elapsedTime/1000 * this.Players[j][0].Velocity.Y;
				this.Players[j][0].Fall = true;
			}
			else if(county <= 0){
				this.Players[j][0].Position.Y += elapsedTime/1000 * this.Players[j][0].Velocity.Y;
				this.Players[j][0].updtPos();
			}

			if(this.Container.localToGlobal(this.Players[j][0].Position.X,this.Players[j][0].Position.Y).x < -this.Players[j][0].Size.X){
				if(this.Players[j][1] == PlayerType.Local)
					this.Death.call(this.Parent);
			}
			if(this.Players[j][0].Position.Y > this.Height){
				if(this.Players[j][1] == PlayerType.Local)
					this.Death.call(this.Parent);	
			}
		}
	},

	log: function(obj){
		if(this.Debug == true){
			console.log(obj);
		}
	}
});