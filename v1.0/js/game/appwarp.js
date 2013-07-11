var INITIALIZE = false;
var DEBUG_WARP = false;
var IS_CONNECTED = false;
var CALLING_OBJECT;
var ROOM_ID;
var MY_ID;
var ROOM_CROWD;
var GAME_OBJECT;
var GAME_PLAY;
var MESSAGES = new Array();

var AppWarp = {
	init: function(akey,skey)
	{
		if(INITIALIZE == false)
		{
			WarpClient.initialize(akey, skey);
			WarpClient.addConnectionRequestListener(new MyConnectionRequestListener());
			WarpClient.addLobbyRequestListener(new MyLobbyRequestListener());
			WarpClient.addZoneRequestListener(new MyZoneRequestListener());
			WarpClient.addRoomRequestListener(new MyRoomRequestListener());
			WarpClient.addChatRequestListener(new MyChatRequestListener());
			WarpClient.addUpdateRequestListener(new MyUpdateRequestListener());
			WarpClient.addNotificationListener(new MyNotificationListener());

			INITIALIZE = true;
		}
	},

	connect: function(akey, skey, user, obj){
		CALLING_OBJECT = obj;
		ROOM_CROWD = 0;
		GAME_PLAY = false;
		ROOM_ID = null;
		if(IS_CONNECTED == false)
		{
			this.init(akey,skey);
			WarpClient.connect(user);
			MY_ID = user;
		}
		else
		{
			CALLING_OBJECT.onConnected();
		}
	},

	begin: function()
	{
		WarpClient.joinRoomInRange(0,1,true);
	},

	leaveRoom: function()
	{
		GAME_PLAY = false;
		WarpClient.unSubscribeRoom(ROOM_ID);
	},

	gamebegin: function(obj)
	{
		GAME_PLAY = true;
		GAME_OBJECT = obj;

		for(var i=0; i<MESSAGES.length; i++)
		{
			GAME_OBJECT.onMessage(MESSAGES[i][0],MESSAGES[i][1]);
		}
	},

	send: function(msg,x,y,vx,vy)
	{
		if(GAME_PLAY == true)
		{
			var dt = new Date();
			var time = dt.getUTCHours()*60*60*1000 + dt.getUTCMinutes()*60*1000 + dt.getUTCSeconds()*1000 + dt.getUTCMilliseconds();
			WarpClient.sendChat({message: msg, x: x, y: y, vx:vx,vy:vy, time: time});
		}
	}
}

function MyConnectionRequestListener() {
	this.onConnectDone = function(result){
		if(DEBUG_WARP == true)
			console.log('connection result ' +result);

		if(result == 0)
		{
			IS_CONNECTED = true;
			CALLING_OBJECT.onConnected();
		}
		else
		{
			IS_CONNECTED = false;
		}
	};
	
	this.onDisconnectDone = function(result){
		if(DEBUG_WARP == true)
			console.log('disconnect result ' +result);

		IS_CONNECTED = false;
	};	
}

function MyLobbyRequestListener(){
	this.onJoinLobbyDone = function(event){
		if(DEBUG_WARP == true)
			console.log('join lobby result ' +event.result);
	}
	this.onLeaveLobbyDone = function(event){					
		if(DEBUG_WARP == true)
			console.log('leave lobby result ' +event.result);
	};

	this.onSubscribeLobbyDone = function(event){
		if(DEBUG_WARP == true)
			console.log('subscribe lobby result ' +event.result);
	};
	this.onUnsubscribeLobbyDone = function(event){
		if(DEBUG_WARP == true)
			console.log('unsubscribe lobby result ' +event.result);
	};
	this.onGetLiveLobbyInfoDone = function(event){
		if(DEBUG_WARP == true)
			console.log('live  lobby info result ' +event.result );
	};
}

function MyZoneRequestListener() {
	this.onCreateRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('create room result ' +event.result);

		if(event.result == 0)
		{
			ROOM_ID = event.roomdata.id;
			WarpClient.joinRoom(ROOM_ID);
		}
	};
	this.onDeleteRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('delete room result ' +event.result);
	};
	this.onGetAllRoomsDone = function(event){
		if(DEBUG_WARP == true)
			console.log('count of rooms ' +event.roomIdArray.length);
	};
	this.onGetOnlineUsersDone = function(event){
		if(DEBUG_WARP == true)
			console.log('get online users result ' +event.result);
	};
	this.onGetLiveUserInfoDone = function(event){
		if(DEBUG_WARP == true)
			console.log('get live user info result ' +event.result);
	};
	this.onSetCustomUserInfoDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Set Custom user Data result ' +event.result);
	};
	this.onGetMatchedRoomsDone = function(event){
		if(DEBUG_WARP == true)
			console.log('onGetMatchedRoomsDone result ' +event.result);
	};
}

function MyRoomRequestListener() {
	this.onSubscribeRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('subscribe room result ' +event.result);

		if(event.result == 0)
		{
			WarpClient.getLiveRoomInfo(ROOM_ID);
		}
	};
	this.onUnsubscribeRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Unsubscribe room result ' +event.result);

		WarpClient.leaveRoom(ROOM_ID);
	};
	this.onJoinRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Join room result ' +event.result);

		if(event.result == 2)
		{
			WarpClient.createRoom("room","admin",2);
		}
		else if(event.result == 0)
		{
			ROOM_ID = event.roomdata.id;
			WarpClient.subscribeRoom(ROOM_ID);
		}
	};
	this.onLeaveRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Leave room result ' +event.result);
	};
	this.onGetLiveRoomInfoDone = function(event){
		if(DEBUG_WARP == true)
			console.log('onGetLiveRoomInfoDone result ' +event.result);

		if(event.result == resultcode_success){
			if(DEBUG_WARP == true){
				console.log('Count of users in room ' +event.roomdata.id + ' is ' + event.userNameArray.length);
			}
		}		

		ROOM_CROWD = event.userNameArray.length;

		if(event.result == 0 && ROOM_CROWD == 2)
		{
			CALLING_OBJECT.onJoined();
		}
	};
	this.onSetCustomRoomDataDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Set Custom room data result ' +event.result);
	};
	this.onUpdatePropertyDone = function(event){
		if(DEBUG_WARP == true)
			console.log('onUpdatePropertyDone result ' +event.result);
	};
	this.onLockPropertiesDone = function(result)
	{
		if(DEBUG_WARP == true)
			console.log('onLockPropertiesDone result ' +result);
	}
	this.onUnlockPropertiesDone = function(result)
	{
		if(DEBUG_WARP == true)
			console.log('onUnlockPropertiesDone result ' +result);
	}
}

function MyChatRequestListener() {
	this.onSendChatDone = function(result){
		if(DEBUG_WARP == true)
			console.log('Send Chat result ' +result);

		if(GAME_PLAY == true)
		{
			if(GAME_OBJECT)
			{
				GAME_OBJECT.onChatDone();
			}
		}
	};	


	this.onSendPrivateChatDone = function(result)
	{
		if(DEBUG_WARP == true)
			console.log('Send Private Chat result ' +result);
	};
}

function MyUpdateRequestListener() {
	this.onSendUpdateDone = function(result){
		if(DEBUG_WARP == true)
			console.log('Send Update result ' +result);
	};
}

function MyNotificationListener() {
	this.onRoomCreated = function(roomdata){
		if(DEBUG_WARP == true)
			console.log('onRoomCreated ' +roomdata.id);
	};
	this.onRoomDestroyed = function(roomdata){
		if(DEBUG_WARP == true)
			console.log('onRoomDestroyed ' +roomdata.id);
	};
	this.onUserLeftRoom = function(roomdata, user){
		if(DEBUG_WARP == true)
			console.log('Left room ' +roomdata.id);

		if(GAME_PLAY == true)
		{
			if(GAME_OBJECT)
			{
				GAME_OBJECT.onRemoteLeft();
			}
		}
	};
	this.onUserJoinedRoom = function(roomdata, user){
		if(DEBUG_WARP == true)
			console.log('joined room ' +roomdata.id);

		if(ROOM_CROWD == 1)
		{
			ROOM_CROWD = 2;
			CALLING_OBJECT.onJoined(user);
		}
	};
	this.onUserLeftLobby = function(lobbydata, user){
		if(DEBUG_WARP == true)
			console.log('user left lobby ' +user);
	};
	this.onUserJoinedLobby = function(lobbydata, user){
		if(DEBUG_WARP == true)
			console.log('user joined lobby' +user);
	};
	this.onChatReceived = function(chatevent){
		if(DEBUG_WARP == true)
			console.log(chatevent.sender +' says ' +chatevent.chat);

		if(GAME_PLAY == true)
		{
			if(GAME_OBJECT)
			{
				if(chatevent.sender != MY_ID)
					GAME_OBJECT.onMessage(chatevent.sender, chatevent.chat);
			}
		}
		else
		{
			//MESSAGES.push([chatevent.sender, chatevent.chat]);
			CALLING_OBJECT.onMessage(chatevent.chat, chatevent.sender, MY_ID);
		}
	};
	this.onPrivateChatReceived = function(sender, chat)
	{
		if(DEBUG_WARP == true)
			console.log(sender + " sended you privated chat : "+ chat);

		CALLING_OBJECT.onMessage(chat, sender, MY_ID);
	};
	this.onUpdatePeersReceived = function(updateevent){
		if(DEBUG_WARP == true)
			console.log('Got updatepeers with bytes ' +updateevent.update.length);
	};	
	this.onUserChangeRoomProperty = function(user,properties, lockProperties){
		if(DEBUG_WARP == true)
			console.log('onUserChangeRoomProperty ', user, " changed ", properties, "Locked Properties " , lockProperties);
	};	
}