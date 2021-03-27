var stompClient = null;
var currentUser = GetQueryString("user");

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/elon-webim-websocket?user=' + currentUser);
    $("#name").val(currentUser);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
        	console.log(greeting);
            showGreeting(JSON.parse(greeting.body).content);
        });
        
        //
        stompClient.subscribe('/user/topic/'+currentUser, function (message) {
        	console.log(message);
            showMessage(JSON.parse(message.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function sendMessageToUser(){
	var userName = $("#send-to-username").val();
	var content = $("#send-to-message").val();

    // 设置待发送的消息内容
    var message = '{"to":"' + userName + '", "destination": "/topic/' + userName + '", "content": "' + content + '"}';
    // 发送消息
	stompClient.send("/app/test", {}, message);
}

function showMessage(message) {
    $("#private-conversation-messages").append("<tr><td>" + message.from + ":" + message.content + "</td></tr>");
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $( "#sendMsgToUserBtn" ).click(function() { sendMessageToUser(); });
});