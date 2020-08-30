// Special Thanks to Danny Hawk for giving me a jumping point to experiment with - Your brain is too powerful, sir
/**
 * FUNCTION: App.js is the controlling force behind the entire gameshow. Crucially,
 * app.js contains the game states (const scenes) and is in charge of maintaining the
 * current state of the game. App.js also fetches any data from mongodb so that it can
 * make sure all connections are dealing with the same data. Besides that, app.js just
 * handles the connections of game.js and mobile.js, delivering the current game state
 * to them.
 *
 * CREATOR: Danny Hawk
 */

//also special thanks to free radish for the jack box room system -- you're a beautiful child


//#region GAME LOGIC
//this is where the const scenes in Danny's version are
//#endregion

//#region SERVER SETUP
const express = require('express');
const WebSocket = require('ws');
const server = require('http').createServer();
const app = require('./http-server');
const port = process.env.PORT || process.env.NODE_PORT || 8080;
//var io = require('socket.io')(server);
//var mongo = require('mongodb').MongoClient; //not sure if I need this

//"mongodb://localhost:27017/mydb";

server.on('request', app);

//rooms is a map of room codes to a list of players in that room
const rooms = new Map();
//room clients is a map of room codes to the room client itself
const roomClients = new Map();

//TODO adding a room manually until game-side exists
rooms.set('tests', []);

const wss = new WebSocket.Server({server});
//#endregion


//#region ARE WE ALIVE?

//is the server still up?
//Used for connection liveness testing 
function noop() { };
function heartbeat() {
    this.isAlive = true;
};

//are people still here?
function leaveRoom(ws) {
    if (ws.inGame === true) {
        //remove the player from the game's lobby
        const players = rooms.get(ws.room);
        players.splice(players.indexOf(ws.nick), 1);
        rooms.set(ws.room, players);
    }
}
//#endregion

//Establish connections and handle events
wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.room = '';
    ws.nick = '';
    ws.inGame = false;
    ws.on('pong', heartbeat);

    ws.on('message', (message) => {
        var thesisMSG = JSON.parse(message); // okay so thesisMSG replaces radishMSG in all scripts from here on out okay?
        ws.room = thesisMSG.roomCode.toLowerCase();
        if (thesisMSG.nickname) {
            ws.nick = thesisMSG.nickname.toLowerCase
        }
        switch(thesisMSG.messageType) {
        case 'CREATE_ROOM_REQUEST': {
                rooms.set(ws.room, []);
                roomClients.set(ws.room, ws);
                const response = {
                    messageType: 'ROOM_CREATED_SUCCESS',
                    roomCode: ws.room
                }
                ws.send(JSON.stringify(response));
            }
        break;

        case 'ROOM_JOIN_REQUEST': {
                if (!rooms.has(ws.room)) {
                    //Tried to connect to a room that doesn't exist
                    const response = {
                        messageType: 'ERROR_INVALID_ROOM',
                        roomCode: ws.room,
                        nickname: ws.nick
                    }
                    ws.send(JSON.stringify(response));
                }
            }
        break;
        case 'DISCONNECTED' : {
            leaveRoom(ws);
        }
        break;
        case 'START_GAME_REQUEST': {
            const response = {
                messageType: 'GAME_STARTED',
                roomCode: ws.room
            }
            broadcast(JSON.stringify(response));
        }
        break;
        case 'SEND_PLAYER_DATA': {
            //The game is sending a message to a single player
            const target = findPlayerInRoom(ws.room, thesisMSG.targetPlayer).client;
            const gameToPlayer = { ...thesisMSG };
            gameToPlayer.messageType = "GAME_TO_PLAYER";
            gameToPlayer.nickname = thesisMSG.targetPlayer;
            target.send(JSON.stringify(gameToPlayer));
        }
        break;
        case 'SEND_GAME_DATA': {
            //A player is sending a message to the game
            const target = roomClients.get(ws.room);
            const playerToGame = { ...thesisMSG };
            playerToGame.messageType = "PLAYER_TO_GAME";
            target.send(JSON.stringify(playerToGame));
        }
        break;
        case 'SEND_BROADCAST': {
            //Game is sending a message to all players 
            broadcast(message);
        }
        break;
    }
    });
});

//Perform heartbeats to test for liveness is you live?
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            leaveRoom(ws);
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 1000);
//check to see this ping number's influence later. 

function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function findPlayerInRoom(room, nickname) {
    const players = rooms.get(room);
    if (players === undefined) {
        return null;
    } else {
        return players.find((item) => item.nick == nickname);
    }
}


server.listen(port, () => console.log(`The Thesis God is listening on port ${port}`));
