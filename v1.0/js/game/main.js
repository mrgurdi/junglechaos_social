
var WARP_API_KEY = "23ed44d53ec259513914102e56308f32aa933740530466f701bbf596dfa5cd56";
var WARP_SECRETE_KEY = "ef92c5386307e34b9b5f78d17dd168d9f910e3f04c0d2d08729cf41fda078cf0";

var Loader = Scene.$extend({
	__init__ : function()
	{
		this.$super();
		this.total = 0;
		this.loaded = 0;
	},
	load:function(res, snd, x,y,obj)
	{
		this.bg = new createjs.Shape();
		this.bg.graphics.beginFill("#7EA298").drawRect(0,0,x,y);
		this.getInstance().addChild(this.bg);

		this.arc = new createjs.Shape();
		this.arc.graphics.beginFill("#DAD8CB").drawCircle(x/2, y/2, 5);
		this.getInstance().addChild(this.arc);

		this.arc2 = new createjs.Shape();
		this.arc2.graphics.beginStroke("#DAD8CB").drawCircle(x/2, y/2, 100);
		this.getInstance().addChild(this.arc2);

		this.text = new createjs.Text("Loading", "12px Arial", "#DAD8CB");
 		this.text.x = x/2 - 25;
 		this.text.y = y/2 + 120;
 		this.getInstance().addChild(this.text);

		this.total = Object.keys(res).length;

		var that = this;
		createjs.Sound.addEventListener("fileload",  function(){
			for(var key in res){
				if(res.hasOwnProperty(key)){
					var image = new Image();
					image.onload = function(){
						that.loaded++;
						that.arc.graphics.beginFill("#DAD8CB").drawCircle(x/2, y/2, 5+((that.loaded/that.total)*95));
						
						if(that.loaded == that.total)
						{
							var intro = new Intro(x,y,obj);
							obj.changeScene(intro);
						}	
					}
					image.src = res[key];
				}
			}
		});

		createjs.Sound.registerManifest(sounds);
	}
});

var Intro = Scene.$extend({
	__init__:function(w,h,game)
	{
		this.$super();
		this.scene = this.getInstance();

		var bg = new createjs.Shape();
		bg.graphics.beginFill("#FFF").drawRect(0,0,w,h);
		this.scene.addChild(bg);

		var img = new createjs.Bitmap("res/img/shephertz.png");
		img.x = w/2 - img.image.width/2;
		img.y = h/2 - img.image.height/2;
		img.alpha = 0;
		this.scene.addChild(img);

		createjs.Tween.get(img).to({alpha:1}, 1000).wait(1000).to({alpha:0},1000).call(function(){
			createjs.Sound.play("bgm","none",0,0,-1,0.5,0);
			var menu = new Menu(w,h,game);
			game.changeScene(menu);
		});
	}
});

var Menu = Scene.$extend({
	__init__: function(w,h,game)
	{
		this.$super();
		this.scene = this.getInstance();
		this.game = game;
		this.w = w;
		this.h = h;

		this.bg = new ParallaxBG("res/img/bg3.png","res/img/bg2.png",5,10,240,240,0,0,w,h);
		this.scene.addChild(this.bg.getBG());

		this.gui = new Container(w/2 - 512/2,h/2 - 512/2);
		this.scene.addChild(this.gui.getContainer());

		this.gui2 = new Container(this.w - 50,this.h - 50);
		this.scene.addChild(this.gui2.getContainer());

		this.gui3 = new Container(0,this.h - 64);
		this.scene.addChild(this.gui3.getContainer());

		this.setupMenu();

		App42Lib.init(WARP_API_KEY,WARP_SECRETE_KEY);
	},

	setupMenu: function(){
		this.gui.removeChildren();
		this.gui.addBitmap("res/img/title.png",0,0);
		this.gui.addButton("res/img/start_btn.png",128,128+60,this,this.singlePlayer);
		this.gui.addButton("res/img/multi_btn.png",128,128+60+60,this,this.multiPlayer);
		this.gui.addButton("res/img/help_btn.png",128,128+60+60+60,this,this.help);
		this.gui.addButton("res/img/credits_btn.png",128,128+60+60+60+60,this,this.credits);

		this.gui2.addButton("res/img/sound_on.png",0,0,this,this.soundBtn);

		this.gui3.addButton("res/img/fb.png",0,0,this,this.fbInivite);
		this.gui3.addButton("res/img/trophy.png",64,0,this,this.leaderboards);
	},

	update:function(elapsedTime)
	{
		this.$super();
		this.bg.update(elapsedTime);
	},

	singlePlayer : function()
	{
		var game = new SinglePlayer(this.w,this.h,this.game);
		this.game.changeScene(game);
	},

	multiPlayer : function()
	{
		//var game = new MultiPlayer(this.w,this.h,this.game);
		var game = new MultiplayerWaitScreen(this.w,this.h,this.game);
		this.game.changeScene(game);
	},

	help : function()
	{
		this.gui.removeChildren();
		this.gui.addBitmap("res/img/help.png",0,0-20);
		this.gui.addButton("res/img/close_btn.png",128,384-20,this,this.setupMenu);
	},

	credits : function()
	{
		this.gui.removeChildren();
		this.gui.addBitmap("res/img/credits.png",0,0-20);
		this.gui.addButton("res/img/close_btn.png",128,384-20,this,this.setupMenu);
	},

	soundBtn: function()
	{
		var vol = createjs.Sound.getVolume();
		if(vol == 0)
			createjs.Sound.setVolume(1);
		else
			createjs.Sound.setVolume(0);
	},

	fbInivite: function()
	{
		FB.ui({method: 'apprequests',
          message: 'Jungle Chaos is a multiplier jump n run game'
        });
	},

	leaderboards: function()
	{
		var board = new LeaderBoard(this.w,this.h,this.game);
		this.game.changeScene(board);
	}
});

var GameOver = Scene.$extend({
	__init__:function(w,h,game,score)
	{
		this.$super();
		this.scene = this.getInstance();
		this.game = game;
		this.w = w;
		this.h = h;
		this.score = score;

		this.bg = new ParallaxBG("res/img/bg3.png","res/img/bg2.png",5,10,240,240,0,0,w,h);
		this.scene.addChild(this.bg.getBG());

		this.gui = new Container(w/2 - 512/2,h/2 - 512/2);
		this.scene.addChild(this.gui.getContainer());
		this.setupMenu();
	},

	setupMenu: function(){
		this.gui.removeChildren();
		this.gui.addButton("res/img/title.png",0,0,this,this.singlePlayer);
		this.gui.addBitmap("res/img/gameover.png",128,128);
		this.gui.addButton("res/img/close_btn.png",128,128+128+128+64,this, function(){
			var menu = new Menu(this.w,this.h,this.game);
			this.game.changeScene(menu);
		});

		var that = this;
		this.gui.addButton("res/img/fbshare.png",128+64,128+128+128,this, function(){
			FB.ui(
			  {
			   method: 'feed',
			   name: 'JungleChaos',
			   caption: 'Check out this cool game `Jungle Chaos`',
			   description: (
			      'I made a score of '+ Math.floor(that.score)
			   ),
			   link: 'http://apps.facebook.com/junglechaos',
			   picture: 'https://raw.github.com/shephertz/junglechaos_social/master/v0.1/art/face1.png'
			  },
			  function(response) {
			    if (response && response.post_id) {
			      //alert('Post was published.');
			    } else {
			      //alert('Post was not published.');
			    }
			  }
			);
		});

		this.scr_text = new createjs.Text("Score : "+Math.round(this.score), "50px Lily Script One", "#000");
		this.scr_text.x = 128;
		this.scr_text.y = 128+128+64;
		this.scr_text.textBaseline = "alphabetic";
		this.gui.getContainer().addChild(this.scr_text);
	},

	update:function(elapsedTime)
	{
		this.$super();
		this.bg.update(elapsedTime);
	}
});

var YouWon = Scene.$extend({
	__init__:function(w,h,game,score)
	{
		this.$super();
		this.scene = this.getInstance();
		this.game = game;
		this.w = w;
		this.h = h;
		this.score = score;

		this.bg = new ParallaxBG("res/img/bg3.png","res/img/bg2.png",5,10,240,240,0,0,w,h);
		this.scene.addChild(this.bg.getBG());

		this.gui = new Container(w/2 - 512/2,h/2 - 512/2);
		this.scene.addChild(this.gui.getContainer());
		this.setupMenu();
	},

	setupMenu: function(){
		this.gui.removeChildren();
		this.gui.addButton("res/img/title.png",0,0,this,this.singlePlayer);
		this.gui.addBitmap("res/img/youwon.png",128,128);
		this.gui.addButton("res/img/close_btn.png",128,128+128+128+64,this, function(){
			var menu = new Menu(this.w,this.h,this.game);
			this.game.changeScene(menu);
		});

		var that = this;
		this.gui.addButton("res/img/fbshare.png",128+64,128+128+128,this, function(){
			FB.ui(
			  {
			   method: 'feed',
			   name: 'JungleChaos',
			   caption: 'Check out this cool game `Jungle Chaos`',
			   description: (
			      'I made a score of '+ Math.floor(that.score)
			   ),
			   link: 'http://apps.facebook.com/junglechaos',
			   picture: 'https://raw.github.com/shephertz/junglechaos_social/master/v0.1/art/face1.png'
			  },
			  function(response) {
			    if (response && response.post_id) {
			      //alert('Post was published.');
			    } else {
			      //alert('Post was not published.');
			    }
			  }
			);
		});

		this.scr_text = new createjs.Text("Score : "+Math.round(this.score), "50px Lily Script One", "#000");
		this.scr_text.x = 128;
		this.scr_text.y = 128+128+64;
		this.scr_text.textBaseline = "alphabetic";
		this.gui.getContainer().addChild(this.scr_text);
	},

	update:function(elapsedTime)
	{
		this.$super();
		this.bg.update(elapsedTime);
	}
});

var MultiplayerWaitScreen = Scene.$extend({
	__init__:function(w,h,game)
	{
		this.$super();
		this.scene = this.getInstance();

		this.w = w;
		this.h = h;
		this.game = game;

		this.bg = new ParallaxBG("res/img/bg3.png","res/img/bg2.png",5,10,240,240,0,0,w,h);
		this.scene.addChild(this.bg.getBG());

		this.gui = new Container(w/2 - 512/2,h/2 - 512/2);
		this.scene.addChild(this.gui.getContainer());
		this.scr_text = new createjs.Text("Connecting...", "50px Lily Script One", "#000");
		this.scr_text.x = 128;
		this.scr_text.y = 128+128;
		this.scr_text.textBaseline = "alphabetic";
		this.gui.getContainer().addChild(this.scr_text);

		this.state = 0; // 0 - NotConnected 1 - Connected 2-Joined
		this.shakes = 0;
		var that = this;
		window.setTimeout(function(){
			if(that.state == 0)
			{
				that.scr_text.x = 0;
				that.scr_text.text = "Check Internet Connection";
				that.gui.addButton("res/img/close_btn.png",128,128+128+64,that, function(){
					var menu = new Menu(that.w,that.h,that.game);
					that.game.changeScene(menu);
				});
			}
		}, 15000 );
		AppWarp.connect(WARP_API_KEY,WARP_SECRETE_KEY,FB_ID,this);
	},

	update:function(elapsedTime)
	{
		this.$super();
		this.bg.update(elapsedTime);
	},

	onConnected: function()
	{
		this.scr_text.x = 0;
		this.scr_text.text = "Searching for opponent...";
		this.state = 1;

		var that = this;
		window.setTimeout(function(){
			if(that.state == 1)
			{
				that.scr_text.x = 0;
				that.scr_text.text = "Sorry!!! No one found :(";
				AppWarp.leaveRoom();
				that.gui.addButton("res/img/close_btn.png",128,128+128+64,that, function(){
					var menu = new Menu(that.w,that.h,that.game);
					that.game.changeScene(menu);
				});
			}
		}, 30000 );

		AppWarp.begin();
	},

	onJoined: function(user)
	{
		this.state = 2;
		this.scr_text.x = 0;
		this.scr_text.text = "Waiting for Response...";

		if(user)
		{
			WarpClient.sendPrivateChat(user,{message : "handshake"});
			this.shakes += 1;
		}
		else
			WarpClient.sendChat({message : "handshake"});
	},

	onMessage: function(msg,sender, you)
	{
		//console.log((JSON.parse(msg)).message, sender, you);
		if((JSON.parse(msg)).message == "handshake")
		{
			this.shakes += 1;
			//console.log("shakes",this.shakes);
		}

		if(this.shakes == 2)
		{
			this.shakes = 0;
			var game = new MultiPlayer(this.w,this.h,this.game);
			this.game.changeScene(game);
		}
	}
});

var LeaderBoard = Scene.$extend({
	__init__:function(w,h,game)
	{
		this.$super();
		this.scene = this.getInstance();
		this.game = game;
		this.w = w;
		this.h = h;

		this.bg = new ParallaxBG("res/img/bg3.png","res/img/bg2.png",5,10,240,240,0,0,w,h);
		this.scene.addChild(this.bg.getBG());

		this.gui = new Container(w/2 - 512/2,h/2 - 600/2);
		this.scene.addChild(this.gui.getContainer());
		this.setupMenu();
	},

	setupMenu: function(){
		this.gui.removeChildren();
		this.gui.addButton("res/img/title.png",0,0,this,this.singlePlayer);
		this.gui.addButton("res/img/close_btn.png",128,536,this, function(){
			var menu = new Menu(this.w,this.h,this.game);
			this.game.changeScene(menu);
		});

		this.scr_text = new createjs.Text("Loading leaderboards" , "28px Lily Script One", "#000");
		this.scr_text.x = 128;
		this.scr_text.y = 128+64;
		this.scr_text.textBaseline = "alphabetic";
		this.gui.getContainer().addChild(this.scr_text);

		var that = this;		
		App42Lib.getTopRankings(function(obj){
			var objson = JSON.parse(obj);
			that.scores = objson.app42.response.games.game.scores.score;
			that.scr_text.text = "";
			addEntries(0);
		});

		function addEntries(k)
		{
			if(k<10)
			{
				FB.api("/"+that.scores[k].userName,function(response){
					addEntry(k,response.name,that.scores[k].value);
					addEntries(k+1);
				});
			}
		}

		function addEntry(k,name,score)
		{

			scr_text = new createjs.Text(name , "28px Lily Script One", "#000");
			scr_text.x = 0;
			scr_text.y = 128+32+k*32;
			scr_text.textBaseline = "alphabetic";
			that.gui.getContainer().addChild(scr_text);

			var scr_text = new createjs.Text(score, "28px Lily Script One", "#000");
			scr_text.x = 384;
			scr_text.y = 128+32+k*32;
			scr_text.textBaseline = "alphabetic";
			that.gui.getContainer().addChild(scr_text);
		}
		//for(i=0; i<10; i++)
		//{
			//scr_text = new createjs.Text("Score : "+i, "28px Lily Script One", "#000");
			//scr_text.x = 128;
			//scr_text.y = 128+32+i*32;
			//scr_text.textBaseline = "alphabetic";
			//this.gui.getContainer().addChild(scr_text);
		//}
	},

	update:function(elapsedTime)
	{
		this.$super();
		this.bg.update(elapsedTime);
	}
});
