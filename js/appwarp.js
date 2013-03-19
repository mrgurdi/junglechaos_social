
var DEBUG_WARP = true;

var AppWarp = {
	connect: function(akey, skey){
		WarpClient.initialize(akey, skey);
		WarpClient.addConnectionRequestListener(new MyConnectionRequestListener());
		WarpClient.addLobbyRequestListener(new MyLobbyRequestListener());
		WarpClient.addZoneRequestListener(new MyZoneRequestListener());
		WarpClient.addRoomRequestListener(new MyRoomRequestListener());
		WarpClient.addChatRequestListener(new MyChatRequestListener());
		WarpClient.addUpdateRequestListener(new MyUpdateRequestListener());
		WarpClient.addNotificationListener(new MyNotificationListener());
	  			
		WarpClient.connect();
	},

	join: function(id){
		WarpClient.joinZone(id);
	},

	enter: function(roomId){
		WarpClient.joinRoom(roomId);
		WarpClient.subscribeRoom(roomId);
	},

	getRoomInfo: function(roomId){
		WarpClient.getLiveRoomInfo(roomId);
	},

	setRoomData: function(roomId,data){
		WarpClient.setCustomRoomData(roomId,(JSON.stringify(data)));
	},

	sendMsg: function(msg){
		WarpClient.sendChat(JSON.stringify(msg));
	},

	leaveRoom: function(roomId){
		WarpClient.unSubscribeRoom(roomId);
		WarpClient.leaveRoom(roomId);
	},

	getAllRooms: function(){
		WarpClient.getAllRooms();
	},

	createRoom: function(){
		WarpClient.createRoom("JungleChaosRoom", "admin", 5);
	}
}

function MyConnectionRequestListener() {
	this.onConnectDone = function(result){
		if(DEBUG_WARP == true)
			console.log('connection result ' +result);
		PubSub.publish("onConnectDone",result);
	};
	
	this.onJoinZoneDone = function(result){
		if(DEBUG_WARP == true)
			console.log('joinzone result ' +result);
		PubSub.publish("onJoinZoneDone",result);
	};
	
	this.onDisconnectDone = function(result){
		if(DEBUG_WARP == true)
			console.log('disconnect result ' +result);
	};	
}

function MyLobbyRequestListener(){
	this.onJoinLobbyDone = function(event){
		if(DEBUG_WARP == true)
			console.log('join lobby result ' +event.result);
		//WarpClient.removeLobbyRequestListener(lobbyObserver);
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
		PubSub.publish("onCreateRoomDone",event);
	};
	this.onDeleteRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('delete room result ' +event.result);
	};
	this.onGetAllRoomsDone = function(event){
		if(DEBUG_WARP == true)
			console.log('count of rooms ' +event.roomIdArray.length);
		PubSub.publish("onGetAllRoomsDone",event);
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
	
}

function MyRoomRequestListener() {
	this.onSubscribeRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('subscribe room result ' +event.result);
		PubSub.publish("onSubscribeRoomDone",event);
	};
	this.onUnsubscribeRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Unsubscribe room result ' +event.result);
	};
	this.onJoinRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Join room result ' +event.result);
	};
	this.onLeaveRoomDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Leave room result ' +event.result);
	};
	this.onGetLiveRoomInfoDone = function(event){
		if(event.result == resultcode_success){
			if(DEBUG_WARP == true){
				console.log('Count of users in room ' +event.roomdata.id + ' is ' + event.userNameArray.length);
			}

			PubSub.publish("onGetLiveRoomInfoDone",event);
		}		
	};
	this.onSetCustomRoomDataDone = function(event){
		if(DEBUG_WARP == true)
			console.log('Set Custom room data result ' +event.result);
	};
	
}

function MyChatRequestListener() {
	this.onSendChatDone = function(result){
		if(DEBUG_WARP == true)
			console.log('Send Chat result ' +result);
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
			console.log('subscribe room ' +roomdata.id);
	};
	this.onRoomDestroyed = function(roomdata){
		if(DEBUG_WARP == true)
			console.log('Unsubscribe room ' +roomdata.id);
	};
	this.onUserLeftRoom = function(roomdata, user){
		if(DEBUG_WARP == true)
			console.log('Left room ' +roomdata.id);

		PubSub.publish("onUserLeftRoom",[roomdata,user]);
	};
	this.onUserJoinedRoom = function(roomdata, user){
		if(DEBUG_WARP == true)
			console.log('joined room ' +roomdata.id);

		PubSub.publish("onUserJoinedRoom",[roomdata,user]);
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
		PubSub.publish("onChatReceived",chatevent);
	};
	this.onUpdatePeersReceived = function(updateevent){
		if(DEBUG_WARP == true)
			console.log('Got updatepeers with bytes ' +updateevent.update.length);
	};	
}