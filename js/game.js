

var score, multiplier=1;
var FB_ME, FB_Remote;
var FB_ME_pic, FB_Remote_pic;
var FB_UI_link = 'http://apps.facebook.com/junglechaos';//https://developers.facebook.com/docs/reference/javascript/';
var FB_UI_pic = 'http://appwarp.shephertz.com/junglechaos_social/art/face1.png';//http://www.fbrell.com/public/f8.jpg';

var Game = Class.$extend({
	Debug: true,
	State: 0, //0-Loading, 1-Menu,2-Help,3-Credits,4-InGame,5-EndGame, 6-InMultiGame, 7-Win, 8-Search, 9-Wait			

	__init__: function(){
		this.log("Initialising");
		
		this.Width = 950;//window.innerWidth;
		this.Height = 500;//window.innerHeight;
		this.Canvas = document.createElement('canvas');
		this.Canvas.width = this.Width;
		this.Canvas.height = this.Height;
		document.body.appendChild(this.Canvas);
		this.Stage = new createjs.Stage(this.Canvas);

		createjs.Ticker.addListener(this);
		createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);

		createjs.Touch.enable(this.Stage);

		this.Resources = {
			title: "art/title.png",
			practiceBtn:"art/start_btn.png",
			multiplayerBtn:"art/multi_btn.png",
			helpBtn:"art/help_btn.png",
			creditsBtn:"art/credits_btn.png",
			closeBtn:"art/close_btn.png",
			bgImage: "art/bg.png",
			grass: "art/grass.png",
			enemy: "art/enemy_snake.png",
			monkey1: "art/monkey1.png",
			monkey2: "art/monkey2.png",
			credits: "art/credits.png",
			trophy: "art/trophy.png",
			fb_btn: "art/fb.png"
		};

		this.loadResources();
	},

	log: function(obj){
		if(this.Debug == true)
			console.log(obj);
	},

	tick: function(elapsedTime){
		if(this.State !=0){
			this.bg.tick(elapsedTime);
			if(this.State == 4){
				this.world.tick(elapsedTime);
				score = Math.floor((this.player.Position.X * multiplier)/100);
				this.score_msg.setText("Score : "+score);
				multiplier += elapsedTime/1000 * 0.1;
			}
			else if(this.State == 6){
				this.world.tick(elapsedTime);
				score = Math.floor((this.player.Position.X * multiplier)/100);
				this.score_msg.setText("Score : "+score);
				multiplier += elapsedTime/1000 * 0.1;
				/*if(this.world.Players.length > 1)
					this.log(this.world.Players[0][0].Position.X - this.world.Players[1][0].Position.X);
				*/
			}
		}

		this.Stage.update();
	},

	loadResources: function(){
		this.log("Loading");

		var text = new createjs.Text("Loading...", "34px Arial", "#000");
		text.x = this.Width/2 - 75;
		text.y = this.Height/2;
		this.Stage.addChild(text);

		this._Loader = new Loader(this.Debug);
		this._Loader.load(this.Resources,this,this.loadDone);
	},

	loadDone: function(){
		this.log("Loading Completed");
		var that = this;
		FB.api("/me",function(response){
			FB_ME = response;
			FB.api("/me/picture",function(response){
				FB_ME_pic = response.data.url;
				that.menuScreen();
			});
		});
	},

	menuScreen: function(){
		this.log("Start Menu");
		this.State = 1;
		this.Stage.removeAllChildren();

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);

		var menu = new Container(this.Stage,(this.Width/2) - (512/2),(this.Height/2) - (384/2));
		menu.addBitmap(this.Resources.title, 0,0);
		menu.addButton(this.Resources.practiceBtn,128,128,this,this.startGame);
		menu.addButton(this.Resources.multiplayerBtn,128,128+64,this,this.startMultiplayer);
		menu.addButton(this.Resources.helpBtn,128,128+64+64,this,this.helpScreen);
		menu.addButton(this.Resources.creditsBtn,128,128+64+64+64,this,this.creditScreen);
		btn = new Button(this.Stage,this.Resources.trophy,this.Width-96,this.Height-96,this,this.showscores);
		btn2 = new Button(this.Stage,this.Resources.fb_btn,96,this.Height-96,this,this.invite);
	},

	invite: function(){
		FB.ui({method: 'apprequests',
          message: 'Jungle Chaos is a multiplier jump n run game'
        });
	},

	/*showFriendScores_old: function(){
		this.log("FriendsScoreBoard");
		$("#scoreboardFrnds").show();
		$("#scoreboardFrnds #scoresFrnds").html("Please Wait loading...");
		var winH = $(window).height(), winW = $(window).width();
		$("#scoreboardFrnds").css('top', winH / 2 - $("#scoreboardFrnds").height() / 2);
		$("#scoreboardFrnds").css('left', winW / 2 - $("#scoreboardFrnds").width() / 2);

		//that = this;

			function getFBName(id,func){
				FB.api("/"+id,function(response){
					func(id,response.name);
				});
			}

			function getFBPic(id, func){
				FB.api("/"+id+"/picture",function(response){
					func(id,response.data.url)
				});
			}

			function update_score(name,pic,score,i){
				score_html = '<div style="display:block; height: 64px;"><img style="float:right" src="'+pic+'"><b>'+ name + '</b><br>Score : <i>' + score + '</i></div>';
				$("#scoreboardFrnds #scoresFrnds").append(score_html);

				getScore(i+1);
			}

			function getScore(i){
				if(i < friends.length){
					getHeighestScore(friends[i].id, function(obj){
						objson = JSON.parse(obj);
						score = objson.app42.response.games.game.scores.score.value;
						name = friends[i].name;
						getFBPic(friends[i].id, function(id_,pic){
							update_score(name,pic,score,i);
						});
						console.log(friends[i]);
						console.log(objson);
					}, function(){
						getScore(i+1);
					});
				}
			}

		var friends;
		FB.api("/me/friends",function(response){
			friends = response.data;
			getScore(0);
		});

			$("#scoreboardFrnds #scoresFrnds").html("");
	},*/

	showFriendScores: function(){
		this.log("FriendsScoreBoard");
		$("#scoreboardFrnds").show();
		$("#scoreboardFrnds #scoresFrnds").html("Please Wait loading...");
		var winH = $(window).height(), winW = $(window).width();
		$("#scoreboardFrnds").css('top', winH / 2 - $("#scoreboardFrnds").height() / 2);
		$("#scoreboardFrnds").css('left', winW / 2 - $("#scoreboardFrnds").width() / 2);

		//that = this;

			function getFBName(id,func){
				FB.api("/"+id,function(response){
					func(id,response.name);
				});
			}

			function getFBPic(id, func){
				FB.api("/"+id+"/picture",function(response){
					func(id,response.data.url)
				});
			}

			function update_score(name,pic,score,i){
				score_html = '<div class="score" style="display:block; height: 50px;"><img style="float:left; padding-right: 10px;" align="middle" src="'+pic+'">'+ name + '<br>Score : <i>' + score + '</i></div>';
				$("#scoreboardFrnds #scoresFrnds").append(score_html);

				getScore(i+1);
			}

			function getScore(i){
				if(i < scores.length){
					var username = scores[i].userName;
					var score =  scores[i].value;
					getFBName(username, function(id,name){
						getFBPic(id, function(id_,pic){
							//that.log(name + " : " + pic + " => " + score);
							update_score(name,pic,score,i);
						});
					});
				}
			}

		var friends;
		var frnd_arr = new Array();
		FB.api("/me/friends",function(response){
			friends = response.data;
			for(i=0; i<friends.length; ++i){
				frnd_arr[i] = friends[i].id;
			}
			frnd_arr[i] = FB_ME.id;
			getTopRankingsFriends(frnd_arr, function(obj){
				var objson = JSON.parse(obj);
				scores = objson.app42.response.games.game.scores.score;
				getScore(0);
			});
		});

			$("#scoreboardFrnds #scoresFrnds").html("");
	},

	showscores: function(){
		this.log("ScoreBoard");
		$("#scoreboard").show();
		$("#scoreboard #scores").html("Please Wait loading...");
		var winH = $(window).height(), winW = $(window).width();
		$("#scoreboard").css('top', winH / 2 - $("#scoreboard").height() / 2);
		$("#scoreboard").css('left', winW / 2 - $("#scoreboard").width() / 2);

		//that = this;
		getTopRankings(function(obj) {
			objson = JSON.parse(obj);
			//that.log(objson);
			scores = objson.app42.response.games.game.scores.score;

			function getFBName(id,func){
				FB.api("/"+id,function(response){
					func(id,response.name);
				});
			}

			function getFBPic(id, func){
				FB.api("/"+id+"/picture",function(response){
					func(id,response.data.url)
				});
			}

			function update_score(name,pic,score,i){
				score_html = '<div class="score" style="display:block; height: 50px;"><img style="float:left; padding-right: 10px;" align="middle" src="'+pic+'">'+ name + '<br>Score : <i>' + score + '</i></div>';
				$("#scoreboard #scores").append(score_html);
				
				getScore(i+1);
			}

			function getScore(i){
				if(i < scores.length){
					var username = scores[i].userName;
					var score =  scores[i].value;
					getFBName(username, function(id,name){
						getFBPic(id, function(id_,pic){
							//that.log(name + " : " + pic + " => " + score);
							update_score(name,pic,score,i);
						});
					});
				}
			}

			$("#scoreboard #scores").html("");
			/*for(i=0; i<scores.length; ++i){
				//that.log(scores[i]);
				var username = scores[i].userName;
				var score =  scores[i].value;
				that.log(i);
				getFBName(username, function(id,name){
					getFBPic(id, function(id_,pic){
						//that.log(name + " : " + pic + " => " + score);
						update_score(name,pic,score,i);
					});
				});
				//score_html += scores[i].userName + " : " + scores[i].value + "<br>";
			}*/

			getScore(0);
			
		});
	},

	helpScreen: function(){
		this.State = 2;
		this.log("Help Screen");
		this.Stage.removeAllChildren();

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);

		var menu = new Container(this.Stage,(this.Width/2) - (512/2),(this.Height/2) - (384/2));
		menu.addBitmap(this.Resources.title, 0,0);
		menu.addLabel("Press any key, or Press left mouse or",0,128+34,"#eeffd7");
		menu.addLabel("Tap on screen to jump.",0,128+34+34,"#eeffd7");
		menu.addLabel("Avoid Hitting by the snakes, they will kill you.",0,128+34+34+34,"#eeffd7");
		menu.addLabel("Jump over the void to avoid falling in them",0,128+34+34+34+34,"#eeffd7");
		menu.addButton(this.Resources.closeBtn,128,128+34+34+34+34+34+34,this,this.menuScreen);
	},

	creditScreen: function(){
		this.State = 3;
		this.log("Credits Screen");
		this.Stage.removeAllChildren();

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);

		var menu = new Container(this.Stage,(this.Width/2) - (512/2),(this.Height/2)-(400/2));
		//menu.addBitmap(this.Resources.title, 0,0);
		menu.addBitmap(this.Resources.credits, 0,0);
		menu.addButton(this.Resources.closeBtn,128,354,this,this.menuScreen);
	},

	startGame: function(){
		this.State = 4;
		this.log("Practice Game Begins");
		this.Stage.removeAllChildren();

		var Map = [[0,0,100], [800,0,85], [1600,0,69], [2400,0,3], [3200,100,61], [4000,100,29], [4800,0,29], [5600,100,91], [6400,100,53], [7200,0,22], [8000,100,99], [8800,100,59], [9600,0,43], [10400,0,13], [11200,0,37], [12000,100,10], [12800,0,56], [13600,100,79], [14400,0,96], [15200,0,74]];

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);
		this.world = new World(this.Stage,0,0,this.Debug,this.Height,this,this.death);	

		var spritedata  = {
			images: [this.Resources.monkey1],
			frames: {width: 92, height: 132, count:3, regX:0, regY:0},
			animations: {
				run: [0,1,"run",4],
				jump: [2,2,"jump",4]
			}
		};
		this.player = new Player(this.world.Container,spritedata,300,this.Height-300,92,112);
		this.player.setAnimation("run");
		this.player.setVel(this.world.Speed,this.world.Speed);
		
		for(i=0; i<20; i++){
			if(Map[i][2] < 50)
				this.world.addEnemy(this.Resources.enemy,Map[i][0]+250,this.Height-100-50-Map[i][1],64,64);

			this.world.addBlock(this.Resources.grass,Map[i][0],this.Height-100-Map[i][1],600,45);
		}

		this.world.addPlayer(this.player,PlayerType.Local);

		var menu = new Container(this.Stage,this.Width-256,0);
		menu.addButton(this.Resources.closeBtn,0,0,this,function(){location.reload();});

		var score_menu = new Container(this.Stage,10,10);
		if(FB_ME)
		{
			score_menu.addBitmap(FB_ME_pic,0,0);
			score_menu.addLabel(FB_ME.name,50,0,"#eeffd7");
		}
		this.score_msg = score_menu.addLabel("Score : ",0,50,"#eeffd7");

		var that = this;
		document.onkeypress = function(){
			if(that.State == 4){
				if(that.player.Fall == false)
					that.player.Jump = -150;
			}
		}
		this.world.Container.addEventListener("mousedown",function(){
			document.onkeypress();
		});
		this.bg.Container.addEventListener("mousedown",function(){
			document.onkeypress();
		});
	},

	death: function(){
		if(this.State == 6){
			AppWarp.sendMsg({
				"MSG": "death"
			});
			AppWarp.leaveRoom(roomId);
		}

		this.State = 5;
		this.log("Death");
		this.Stage.removeAllChildren();

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);

		var menu = new Container(this.Stage,(this.Width/2) - (512/2),(this.Height/2) - (384/2));
		menu.addBitmap(this.Resources.title, 0,0);
		menu.addLabel("You died!!!",168,128,"#eeffd7");
		menu.addLabel("Score : "+score,168,128+64,"#eeffd7");
		//menu.addButton(this.Resources.closeBtn,128,128+64,this,this.menuScreen);
		menu.addButton(this.Resources.closeBtn,128,128+64+64,this,function(){location.reload();});

			FB.ui(
			  {
			   method: 'feed',
			   name: 'JungleChaos',
			   caption: FB_ME.name+' is playing Jungle Chaos',
			   description: (
			      FB_ME.name+' made a score of '+score
			   ),
			   link: FB_UI_link,
			   picture: FB_UI_pic
			  },
			  function(response) {
			    if (response && response.post_id) {
			      //alert('Post was published.');
			    } else {
			      //alert('Post was not published.');
			    }
			  }
			);

		saveScore(FB_ME.id,score);
	},

	win: function(){
		AppWarp.leaveRoom(roomId);

		this.State = 7;
		this.log("Winning");
		this.Stage.removeAllChildren();

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);

		var menu = new Container(this.Stage,(this.Width/2) - (512/2),(this.Height/2) - (384/2));
		menu.addBitmap(this.Resources.title, 0,0);
		menu.addLabel("You Won!!!",168,128,"#eeffd7");
		score += 10;
		menu.addLabel("Score : "+score,168,128+64,"#eeffd7");
		//menu.addButton(this.Resources.closeBtn,128,128+64,this,this.menuScreen);
		menu.addButton(this.Resources.closeBtn,128,128+64+64,this,function(){location.reload();});

		FB.ui(
		  {
		   method: 'feed',
		   name: 'JungleChaos',
		   caption: FB_ME.name+' is playing Jungle Chaos',
		   description: (
		      FB_ME.name+' defeated ' + FB_Remote.name + ' with a score of '+score
		   ),
		   link: FB_UI_link,
		   picture: FB_UI_pic
		  },
		  function(response) {
		    if (response && response.post_id) {
		      //alert('Post was published.');
		    } else {
		      //alert('Post was not published.');
		    }
		  }
		);

		saveScore(FB_ME.id,score);
	},

	startMultiplayer: function(){
		var rooms = [],roomcount=0;
		this.State = 8;
		var that = this;
		this.ID = (new Date()).getTime();

		PubSub.subscribe("onConnectDone",function(msg,res){
			if(res == 0){
				AppWarp.join(that.ID);
			}
		});
		PubSub.subscribe("onJoinZoneDone",function(msg,res){
			if(res == 0){
				//AppWarp.enter(roomId);
				AppWarp.getAllRooms();
			}
			else{
				AppWarp.join(that.ID);
			}
		});
		PubSub.subscribe("onSubscribeRoomDone",function(msg,res){
			if(res.result == 0){
				//that.multiplayerGame();
				//AppWarp.getRoomInfo(roomId);
			}
		});
		PubSub.subscribe("onUserJoinedRoom",function(msg,res){
			//AppWarp.getRoomInfo(roomId);
			if(that.State == 9){
				that.multiplayerGame();
			}
		});
		PubSub.subscribe("onUserLeftRoom",function(msg,res){
			//AppWarp.getRoomInfo(roomId);
			if(that.State == 6){
				that.win();
			}
		});
		PubSub.subscribe("onGetAllRoomsDone",function(msg,event){
			rooms = [];
			roomcount = event.roomIdArray.length;
			for(var i=0; i<event.roomIdArray.length; i++){
				AppWarp.getRoomInfo(event.roomIdArray[i]);
			}
		});
		PubSub.subscribe("onGetLiveRoomInfoDone",function(msg,res){
			if(that.State == 8){
				rooms.push([res.roomdata.id,res.userNameArray.length,res.roomdata.maxUsers]);
				if(rooms.length == roomcount){
					PubSub.publish("onRoomCountDone",rooms);
				}
			}
		});
		PubSub.subscribe("onRoomCountDone",function(msg,res){
			var count = 0;
			for(i=0; i<roomcount; i++){
				if(that.State == 8){
					if(res[i][1] < 2 && res[i][2] >= 2){
						roomId = res[i][0];
						AppWarp.enter(roomId);
						that.log("Joinning "+ roomId);
						that.State = 9;
						count++;
					}
				}
			}
			if(count == 0){
				that.log("All Rooms are full.");
				AppWarp.createRoom();
			}
		});
		PubSub.subscribe("onCreateRoomDone",function(msg,res){
			if(that.State == 8){
				roomId = res.roomdata.id;
				AppWarp.enter(roomId);
				that.log("Joinning "+ roomId);
				that.State = 9;
			}
		});
		/*PubSub.subscribe("onGetLiveRoomInfoDone",function(msg,res){
			var now = new Date(); 
			var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			var timer;
			if(that.State == 8){
				if(res.userNameArray.length == 1){
					var room_data = {
						"state":"waiting",
						"time": now_utc.getTime()
					};
					AppWarp.setRoomData(roomId,room_data);
				}
				else if(res.userNameArray.length > 1 && res.userNameArray.length < 5){
					var room_data = JSON.parse(res.customData);
					if(room_data.state == "waiting"){
						clearTimeout(timer);
						timer = setTimeout(function(){
							room_data.state = "ingame";
							AppWarp.setRoomData(roomId,room_data);
							that.multiplayerGame();
						},10000-(now_utc.getTime()-room_data.time));
					}
					else{
						that.roomFullError();
					}
				}
				else{
					var room_data = JSON.parse(res.customData);
					if(room_data.state == "ingame"){
						that.roomFullError();
					}
				}
			}
		});*/
		PubSub.subscribe("onChatReceived",function(msg,res){
			if(res.sender != that.ID){
				//that.log(res.sender+" said something");
				var updt = JSON.parse(res.chat);	
				if(updt.MSG == "begin" && that.State == 6){
					var spritedata2  = {
						images: [that.Resources.monkey2],
						frames: {width: 92, height: 132, count:3, regX:0, regY:0},
						animations: {
							run: [0,1,"run",4],
							jump: [2,2,"jump",4]
						}
					};
					remote = new Player(that.world.Container,spritedata2,updt.X,that.Height - updt.Y,92,112,res.sender);
					remote.setAnimation("run");
					remote.setVel(that.world.Speed,that.world.Speed);

					that.world.addPlayer(remote,PlayerType.Remote);

					if(updt.FB_ID){
						FB.api("/"+updt.FB_ID,function(response){
							FB_Remote = response;
							that.remote_msg.setText(FB_Remote.name);
						});
					}
				}
				else if(updt.MSG == "begin" && that.State == 9){
					that.multiplayerGame();

					var spritedata2  = {
						images: [that.Resources.monkey2],
						frames: {width: 92, height: 132, count:3, regX:0, regY:0},
						animations: {
							run: [0,1,"run",4],
							jump: [2,2,"jump",4]
						}
					};
					remote = new Player(that.world.Container,spritedata2,updt.X,that.Height - updt.Y,92,112,res.sender);
					remote.setAnimation("run");
					remote.setVel(that.world.Speed,that.world.Speed);

					that.world.addPlayer(remote,PlayerType.Remote);

					if(updt.FB_ID){
						FB.api("/"+updt.FB_ID,function(response){
							FB_Remote = response;
							that.remote_msg.setText(FB_Remote.name);
						});
						
						FB.api("/"+updt.FB_ID+"/picture",function(response){
							FB_Remote_pic = response.data.url;
							that.score_menu.addBitmap(FB_Remote_pic,0,50);
						});
					}
				}
				else if(updt.MSG == "jump" && that.State == 6){
					remote = that.world.getPlayer(res.sender);
					if(remote){
						remote.Position.X = updt.X;
						remote.Position.Y = that.Height - updt.Y;
						remote.updtPos();
						remote.Jump = -150;
						//that.log(remote.ID+":"+remote.Position.X+"x"+remote.Position.Y);
						//that.log(remote.ID+":"+updt.X+"x"+updt.Y);
						//that.log(res.sender);
						//that.log(that.ID+":"+that.world.player.Position.X+"x"+that.world.player.Position.X);
						//that.log(remote.ID+":"+remote.Position.X+"x"+remote.Position.X);
					}
				}
				else if(updt.MSG == "death" && that.State == 6){
					remote = that.world.getPlayer(res.sender);
					if(remote){
						//remote.Position.X = 0;//updt.X;
						//remote.Position.Y = updt.Y;
						//remote.updtPos();
						that.world.removePlayer(remote.ID);
						that.win();
						//that.log(remote.ID+":"+remote.Position.X+"x"+remote.Position.Y);
						//that.log(remote.ID+":"+updt.X+"x"+updt.Y);
						//that.log(res.sender);
						//that.log(that.ID+":"+that.world.player.Position.X+"x"+that.world.player.Position.X);
						//that.log(remote.ID+":"+remote.Position.X+"x"+remote.Position.X);
					}
				}
			}
		});

		this.connectMultiplayer();
		AppWarp.connect(apikey,secretkey);
	},

	connectMultiplayer: function(){
		//this.Stage.removeAllChildren();
		this.buildWorld();

		this.connect_menu = new Container(this.Stage,(this.Width/2) - (512/2),this.Height/2);
		this.connect_menu.addLabel("Connecting... Please  wait!!!",0,0,"#FFF");
	},

	roomFullError: function(){
		this.Stage.removeAllChildren();

		var menu = new Container(this.Stage,(this.Width/2) - (512/2),this.Height/2);
		menu.addLabel("All rooms are full. Try Later!!!",0,0,"#000");
	},

	buildWorld: function(){
		this.Stage.removeAllChildren();

		var Map = [[0,0,100], [800,0,85], [1600,0,69], [2400,0,3], [3200,100,61], [4000,100,29], [4800,0,29], [5600,100,91], [6400,100,53], [7200,0,22], [8000,100,99], [8800,100,59], [9600,0,43], [10400,0,13], [11200,0,37], [12000,100,10], [12800,0,56], [13600,100,79], [14400,0,96], [15200,0,74]];

		this.bg = new Background(this.Stage,this.Resources.bgImage,540,1080,this.Width,this.Height);
		this.world = new World(this.Stage,0,0,this.Debug,this.Height,this,this.death);	

		for(i=0; i<20; i++){
			if(Map[i][2] < 50)
				this.world.addEnemy(this.Resources.enemy,Map[i][0]+250,this.Height-100-50-Map[i][1],64,64);

			this.world.addBlock(this.Resources.grass,Map[i][0],this.Height-100-Map[i][1],600,45);
		}
	},

	multiplayerGame: function(){
		this.State = 6;
		this.log("Multiplayer Game Begins");
		this.connect_menu.removeChildren();
		
		var spritedata  = {
			images: [this.Resources.monkey1],
			frames: {width: 92, height: 132, count:3, regX:0, regY:0},
			animations: {
				run: [0,1,"run",4],
				jump: [2,2,"jump",4]
			}
		};

		this.player = new Player(this.world.Container,spritedata,300,this.Height-300,92,112,this.ID);
		this.player.setAnimation("run");
		this.player.setVel(this.world.Speed,this.world.Speed);

		/*var spritedata2  = {
			images: [this.Resources.monkey2],
			frames: {width: 92, height: 132, count:3, regX:0, regY:0},
			animations: {
				run: [0,1,"run",4],
				jump: [2,2,"jump",4]
			}
		};

		this.remote = new Player(this.world.Container,spritedata2,150,this.Height-300,92,112);
		this.remote.setAnimation("run");
		this.remote.setVel(this.world.Speed,this.world.Speed);

		this.remote1 = new Player(this.world.Container,spritedata2,450,this.Height-300,92,112);
		this.remote1.setAnimation("run");
		this.remote1.setVel(this.world.Speed,this.world.Speed);*/

		this.world.addPlayer(this.player,PlayerType.Local);
		//this.world.addPlayer(this.remote,PlayerType.Remote);
		//this.world.addPlayer(this.remote1,PlayerType.Remote);

		var menu = new Container(this.Stage,this.Width-256,0);
		menu.addButton(this.Resources.closeBtn,0,0,this,function(){location.reload();});

		this.score_menu = new Container(this.Stage,10,10);
		if(FB_ME){
			this.score_menu.addBitmap(FB_ME_pic,0,0);
			this.score_menu.addLabel(FB_ME.name,50,0,"#eeffd7");
		}
		this.remote_msg = this.score_menu.addLabel("Remote Player",50,50,"#eeffd7");
		this.score_msg = this.score_menu.addLabel("Score : ",0,100,"#eeffd7");

		var that = this;
		document.onkeypress = function(){
			if(that.State == 6){
				if(that.player.Fall == false)
				{
					that.player.Jump = -150;
					AppWarp.sendMsg({
						"MSG": "jump",
						"X": that.player.Position.X,
						"Y": that.Height - that.player.Position.Y
					});
				}
			}
		}
		this.world.Container.addEventListener("mousedown",function(){
			document.onkeypress();
		});
		this.bg.Container.addEventListener("mousedown",function(){
			document.onkeypress();
		});

		AppWarp.sendMsg({
			"MSG": "begin",
			"X": this.player.Position.X,
			"Y": this.Height - this.player.Position.Y,
			"FB_ID": FB_ME.id
		});
	}
});