
var World = Class.$extend({
	__init__: function(w,h,mw)
	{
		this.world = new createjs.Container();
		this.floors = new Array();
		this.enemies = new Array();
		this.players = new Array();
		this.remoteplayers = new Array();
		this.callbacks = new Array();
		this.items = new Array();

		this.Velocity = {
			x : 0,
			y : 0
		};

		this.gravity = 300;

		this.w = w;
		this.h = h;

		this.pause = false;

		this.mapWidth = mw;
	},

	getInstance:function()
	{
		return this.world;
	},

	addFloor: function(img,x,y)
	{
		var floor = new createjs.Bitmap(img);
		floor.x = x;
		floor.y = y;
		this.floors.push({x:x, y:y, w:floor.image.width, h:floor.image.height,child: floor});
		this.world.addChild(floor);
	},

	addEnemy: function(img,x,y)
	{
		var enemy = new createjs.Bitmap(img);
		enemy.x = x;
		enemy.y = y;
		this.enemies.push({x:x, y:y, w:enemy.image.width, h:enemy.image.height,child : enemy});
		this.world.addChild(enemy);
	},

	addItem: function(img,x,y, obj, func)
	{
		var item = new createjs.Bitmap(img);
		item.x = x;
		item.y = y;
		this.items.push({child: item,x:x, y:y, w:item.image.width, h:item.image.height, obj: obj || null, func: func || null});
		this.world.addChild(item);
	},

	addPlayer:function(id,data, x, y, index, obj, func)
	{
		var player = new Player();
		player.create(data,x,y);
		this.players[id] = player;
		player.setAnimation(index);
		this.world.addChild(player.getInstance());

		this.callbacks[id] = {obj: obj || null, func: func || null};
	}, 

	addRemotePlayer:function(id,data, x, y, index)
	{
		var player = new Player();
		player.create(data,x,y);
		this.remoteplayers[id] = player;
		player.setAnimation(index);
		this.world.addChild(player.getInstance());
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

	update:function(elapsedTime)
	{
		if(this.pause == false)
		{
			this.world.x += this.Velocity.x * elapsedTime/1000;
			this.world.y += this.Velocity.y * elapsedTime/1000;

			this.updatePlayers(elapsedTime);
			this.updateRemotePlayers(elapsedTime);
		}
	},

	setPlayerPosition:function(id, x, y)
	{
		this.players[id].setPosition(x,y);
	},

	setPlayerVelocity:function(id, x, y)
	{
		this.players[id].setVelocity(x,y);
	},

	addPlayerVelocity:function(id, x, y)
	{
		this.players[id].addVelocity(x,y);
	},

	getPlayerPosition: function(id)
	{
		return this.players[id].getPosition();
	},

	getPlayerVelocity: function(id)
	{
		return this.players[id].getVelocity();
	},

	goInvincible: function(id)
	{
		return this.players[id].goInvincible();
	},

	goInvincibleRemote: function(id)
	{
		return this.remoteplayers[id].goInvincible();
	},

	setRemotePlayerPosition:function(id, x, y)
	{
		this.remoteplayers[id].setPosition(x,y);
	},

	setRemotePlayerVelocity:function(id, x, y)
	{
		this.remoteplayers[id].setVelocity(x,y);
	},

	addRemotePlayerVelocity:function(id, x, y)
	{
		this.remoteplayers[id].addVelocity(x,y);
	},

	getRemotePlayerPosition: function(id)
	{
		return this.remoteplayers[id].getPosition();
	},

	getRemotePlayerVelocity: function(id)
	{
		return this.remoteplayers[id].getVelocity();
	},

	updatePlayers: function(elapsedTime)
	{
		for(p in this.players)
		{
			var pos = this.players[p].getPosition();
			var vel = this.players[p].getVelocity();
			var size = this.players[p].getSize();
			var newPos = {x: pos.x, y:pos.y};

			if(this.players[p].Jump <= 0)
			{
				newPos = {x:pos.x+ (vel.x*elapsedTime/1000), y:pos.y+((vel.y + this.gravity)*elapsedTime/1000)};
			}
			else
			{
				newPos = {x:pos.x+ (vel.x*elapsedTime/1000), y:pos.y-((vel.y + this.gravity)*elapsedTime/1000)};
				this.players[p].Jump -= (vel.y + this.gravity)*elapsedTime/1000;
			}

			var collidex = false;
			var collidey = false;
			for(var i=0; i<this.floors.length; ++i)
			{
				var floor = this.floors[i];
				if(this.checkCollision(floor.x,floor.y+floor.h/2,floor.w,floor.h,newPos.x, pos.y,size.x,size.y) == true)
				{
					collidex = true;
				}

				if(this.checkCollision(floor.x,floor.y+floor.h/2,floor.w,floor.h,pos.x, newPos.y,size.x,size.y) == true)
				{
					collidey = true;
					this.players[p].Falling = false;	
				}
			}
			if(collidex == false)
				this.players[p].setPositionX(newPos.x);
			if(collidey == false)
			{	
				this.players[p].setPositionY(newPos.y);
				this.players[p].Falling = true;
			}

			if(this.players[p].Falling == false && this.players[p].Invincible == false)
			{
				var collide_enemies = false;
				for(var j=0; j<this.enemies.length; ++j)
				{
					var enemy = this.enemies[j];
					if(this.checkCollision(enemy.x,enemy.y,enemy.w,enemy.h,pos.x, pos.y,size.x,size.y) == true)
					{
						collide_enemies = true;
						break;
					}
				}

				if(collide_enemies == true)
				{
					if(this.callbacks[p].func != null)
						this.callbacks[p].func.call(this.callbacks[p].obj);
				}
			}

			for(var k=0; k<this.items.length; ++k)
			{
				var item = this.items[k];
				if(this.checkCollision(item.x,item.y,item.w,item.h,pos.x, pos.y,size.x,size.y) == true)
				{
					//this.world.removeChild(this.items[k].child);
					//this.items.splice(k,1);

					this.items[k].child.x += this.mapWidth;
					this.items[k].x += this.mapWidth;

					if(this.items[k].func != null)
						this.items[k].func.call(this.items[k].obj);
				}
			}

			if(this.world.localToGlobal(this.players[p].getPosition().x,this.players[p].getPosition().y).x < -this.players[p].w)
			{
				if(this.callbacks[p].func != null)
					this.callbacks[p].func.call(this.callbacks[p].obj);
			}

			if(this.world.localToGlobal(this.players[p].getPosition().x,this.players[p].getPosition().y).y > this.h)
			{
				if(this.callbacks[p].func != null)
					this.callbacks[p].func.call(this.callbacks[p].obj);
			}
		}

		for(var u=0; u<this.floors.length; ++u)
		{
			if(this.world.localToGlobal(this.floors[u].x,this.floors[u].y).x < -this.floors[u].w)
			{
				//this.world.removeChild(this.floors[i].child);
				//this.floors.splice(i,1);
				this.floors[u].child.x += this.mapWidth;
				this.floors[u].x += this.mapWidth;
			}
		}

		for(var v=0; v<this.enemies.length; ++v)
		{
			if(this.world.localToGlobal(this.enemies[v].x,this.enemies[v].y).x < -this.enemies[v].w)
			{
				this.enemies[v].child.x += this.mapWidth;
				this.enemies[v].x += this.mapWidth;
			}
		}

		for(var v=0; v<this.items.length; ++v)
		{
			if(this.world.localToGlobal(this.items[v].x,this.items[v].y).x < -this.items[v].w)
			{
				this.items[v].child.x += this.mapWidth;
				this.items[v].x += this.mapWidth;
			}
		}
	},

	updateRemotePlayers: function(elapsedTime)
	{
		for(p in this.remoteplayers)
		{
			var pos = this.remoteplayers[p].getPosition();
			var vel = this.remoteplayers[p].getVelocity();
			var size = this.remoteplayers[p].getSize();
			var newPos = {x: pos.x, y:pos.y};

			if(this.remoteplayers[p].Jump <= 0)
			{
				newPos = {x:pos.x+ (vel.x*elapsedTime/1000), y:pos.y+((vel.y + this.gravity)*elapsedTime/1000)};
			}
			else
			{
				newPos = {x:pos.x+ (vel.x*elapsedTime/1000), y:pos.y-((vel.y + this.gravity)*elapsedTime/1000)};
				this.remoteplayers[p].Jump -= (vel.y + this.gravity)*elapsedTime/1000;
			}

			var collidex = false;
			var collidey = false;
			for(var i=0; i<this.floors.length; ++i)
			{
				var floor = this.floors[i];
				if(this.checkCollision(floor.x,floor.y+floor.h/2,floor.w,floor.h,newPos.x, pos.y,size.x,size.y) == true)
				{
					collidex = true;
				}

				if(this.checkCollision(floor.x,floor.y+floor.h/2,floor.w,floor.h,pos.x, newPos.y,size.x,size.y) == true)
				{
					collidey = true;
					this.remoteplayers[p].Falling = false;	
				}
			}
			if(collidex == false)
				this.remoteplayers[p].setPositionX(newPos.x);
			if(collidey == false)
			{	
				this.remoteplayers[p].setPositionY(newPos.y);
				this.remoteplayers[p].Falling = true;
			}
		}
	},

	checkCollision: function(x,y,w,h, x1,y1,w1,h1){
		if(x1 > x+w 
			|| x1 + w1 < x
			|| y1 > y+h
			|| y1 + h1 < y)
			return false;

		return true;
	},

	jumpPlayer: function(id, y)
	{
		if(this.players[id].Jump <= 0 && this.players[id].Falling == false)
		{
			this.players[id].Jump = y;
		}
		else
			return false;

		return true;
	},

	jumpRemotePlayer: function(id, y)
	{
		if(this.remoteplayers[id].Jump <= 0 && this.remoteplayers[id].Falling == false)
		{
			this.remoteplayers[id].Jump = y;
		}
	}
});