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

var AppWarpHandler = {
	init: function(akey,skey)
	{
		if(INITIALIZE == false)
		{
			AppWarp.WarpClient.initialize(akey, skey);
			this.warpclient = AppWarp.WarpClient.getInstance();
			this.warpclient.enableSSL(true);
			//WarpClient.addConnectionRequestListener(new MyConnectionRequestListener());
			//WarpClient.addLobbyRequestListener(new MyLobbyRequestListener());
			//WarpClient.addZoneRequestListener(new MyZoneRequestListener());
			//WarpClient.addRoomRequestListener(new MyRoomRequestListener());
			//WarpClient.addChatRequestListener(new MyChatRequestListener());
			//WarpClient.addUpdateRequestListener(new MyUpdateRequestListener());
			//WarpClient.addNotificationListener(new MyNotificationListener());
			new MyConnectionRequestListener(this.warpclient);
			new MyZoneRequestListener(this.warpclient);
			new MyRoomRequestListener(this.warpclient);
			new MyChatRequestListener(this.warpclient);
			new MyNotificationListener(this.warpclient);

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
			this.warpclient.connect(user);
			MY_ID = user;
		}
		else
		{
			CALLING_OBJECT.onConnected();
		}
	},

	begin: function()
	{
		this.warpclient.joinRoomInRange(0,1,true);
	},

	leaveRoom: function()
	{
		GAME_PLAY = false;
		this.warpclient.unsubscribeRoom(ROOM_ID);
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
			this.warpclient.sendChat({message: msg, x: x, y: y, vx:vx,vy:vy, time: time});
		}
	}
}

function MyConnectionRequestListener(warpclient) {
	warpclient.setResponseListener(AppWarp.Events.onConnectDone, function(result, reason){
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
	});
	
	warpclient.setResponseListener(AppWarp.Events.onDisconnectDone, function(result){
		if(DEBUG_WARP == true)
			console.log('disconnect result ' +result);

		IS_CONNECTED = false;
	});	
}

function MyZoneRequestListener(warpclient) {
	warpclient.setResponseListener(AppWarp.Events.onCreateRoomDone, function(event){
		if(DEBUG_WARP == true)
			console.log('create room result ' +event.getResult());

		if(event.getResult() == 0)
		{
			ROOM_ID = event.getRoomId();
			warpclient.joinRoom(ROOM_ID);
		}
	});
}

function MyRoomRequestListener(warpclient) {
	warpclient.setResponseListener(AppWarp.Events.onSubscribeRoomDone, function(event){
		if(DEBUG_WARP == true)
			console.log('subscribe room result ' +event.getResult());

		if(event.getResult() == 0)
		{
			warpclient.getLiveRoomInfo(ROOM_ID);
		}
	});
	warpclient.setResponseListener(AppWarp.Events.onUnsubscribeRoomDone, function(event){
		if(DEBUG_WARP == true)
			console.log('Unsubscribe room result ' +event.getResult());

		warpclient.leaveRoom(ROOM_ID);
	});
	warpclient.setResponseListener(AppWarp.Events.onJoinRoomDone, function(event){
		if(DEBUG_WARP == true)
			console.log('Join room result ' +event.getResult());

		if(event.getResult() == 2)
		{
			warpclient.createRoom("room","admin",2);
		}
		else if(event.getResult() == 0)
		{
			ROOM_ID = event.getRoomId();
			warpclient.subscribeRoom(ROOM_ID);
		}
	});
	warpclient.setResponseListener(AppWarp.Events.onGetLiveRoomInfoDone, function(event){
		if(DEBUG_WARP == true)
			console.log('onGetLiveRoomInfoDone result ' +event.getResult());

		if(event.getResult() == 0){
			if(DEBUG_WARP == true){
				console.log('Count of users in room ' +event.getRoomId() + ' is ' + event.getUsers().length);
			}
		}		

		ROOM_CROWD = event.getUsers().length;

		if(event.getResult() == 0 && ROOM_CROWD == 2)
		{
			CALLING_OBJECT.onJoined();
		}
	});
}

function MyChatRequestListener(warpclient) {
	warpclient.setResponseListener(AppWarp.Events.onSendChatDone, function(result){
		if(DEBUG_WARP == true)
			console.log('Send Chat result ' +result.getResult());

		if(GAME_PLAY == true)
		{
			if(GAME_OBJECT)
			{
				GAME_OBJECT.onChatDone();
			}
		}
	});	
}

function MyNotificationListener(warpclient) {
	warpclient.setNotifyListener(AppWarp.Events.onUserLeftRoom, function(roomdata, user){
		if(DEBUG_WARP == true)
			console.log('Left room ' +roomdata.getRoomId());

		if(GAME_PLAY == true)
		{
			if(GAME_OBJECT)
			{
				GAME_OBJECT.onRemoteLeft();
			}
		}
	});
	warpclient.setNotifyListener(AppWarp.Events.onUserJoinedRoom, function(roomdata, user){
		if(DEBUG_WARP == true)
			console.log('joined room ' +roomdata.getRoomId());

		if(ROOM_CROWD == 1)
		{
			ROOM_CROWD = 2;
			CALLING_OBJECT.onJoined(user);
		}
	});
	warpclient.setNotifyListener(AppWarp.Events.onChatReceived, function(chatevent){
		if(DEBUG_WARP == true)
			console.log(chatevent.getSender() +' says ' +chatevent.getChat());

		if(GAME_PLAY == true)
		{
			if(GAME_OBJECT)
			{
				if(chatevent.getSender() != MY_ID)
					GAME_OBJECT.onMessage(chatevent.getSender(), chatevent.getChat());
			}
		}
		else
		{
			//MESSAGES.push([chatevent.getSender(), chatevent.getChat()]);
			CALLING_OBJECT.onMessage(chatevent.getChat(), chatevent.getSender(), MY_ID);
		}
	});
	warpclient.setNotifyListener(AppWarp.Events.onPrivateChatReceived, function(sender, chat)
	{
		if(DEBUG_WARP == true)
			console.log(sender + " sended you privated chat : "+ chat);

		CALLING_OBJECT.onMessage(chat, sender, MY_ID);
	});
}