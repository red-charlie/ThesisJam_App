const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { pingInterval: 500 });
const fs = require("fs");
const Room = require("./modules/room");
const User = require("./modules/user");
//var mongo = require('mongodb').MongoClient;
//var mongourl = "";

const PORT = process.env.PORT || 5000;
let rooms = new Map();

// Prepare csv data
//let contents = fs.readFileSync("./data/categories.csv", "UTF8");
//let categories = contents.split(/,/gm);

app.get("/", (req, res) => {
    res.send(
        "<p>This is the Hackbox backend. It is meant to be accessed with socket.io -- This version is from 5am 9/3</p>"
    );
});

io.on("connection", socket => {

    

    socket.on("request room", () => {
        let res = {};
        let room = new Room(getRandomRoomCode()); // Pass in a randomroomcode
        rooms.set(room.code, room);
        res.roomcode = room.code;

        // Also join this client to the room
        socket.join(room.code);

        socket.emit("request room", JSON.stringify(res));
    });

    socket.on("join room", payload => {
        console.log('I got a join room request');
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        }
        catch (e) {
            socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format" }));
            return;
        }
        let res = {}; //userCount, joined, username, failReason, 
        if (rooms.has(payloadObj.roomcode)) {
            let room = rooms.get(payloadObj.roomcode);


            res.userCount = room.users.length;
            //update current player count here please [charlie]

            ////if 16 people are already in [charlie this isn't working come back later]
            //if (room.users.length = 16) {
            //    console.log('hooray you fit - just kidding');
            //    res.joined = false;
            //    res.username = payloadObj.username;
            //    res.failReason = "Room has too many players";
            //    socket.emit("join room", JSON.stringify(res));
            //    return;
            //}

            // If this room already has this username
             if (room.hasUser(payloadObj.username)) {
                res.joined = false;
                res.username = "";
                res.failReason = "Username is taken please use another name";
                socket.emit("join room", JSON.stringify(res));
            } else {
                socket.join(payloadObj.roomcode);
                room.users.push(new User(payloadObj.username));
                res.joined = true;
                res.username = payloadObj.username;
                res.failReason = "";
                res.userCount = room.users.length;
                console.log('you have joined should be flipping over now');

                // Notify the entire room of success of new player joining
                

                io.to(payloadObj.roomcode).emit("join room", JSON.stringify(res));
               // io.to(payloadObj.roomcode).emit("join room", JSON.stringify(res));
            }
        } else {
            res.joined = false;
            res.username = "";
            res.failReason = "Room does not exist please check room code";
            res.userCount = 0;
            socket.emit("join room", JSON.stringify(res));
            //[charlie] make sure that the join room command moves into the message bit

        }
    });
    socket.on("rejoin room", payload => {
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        }
        catch (e) {
            socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format" }));
            return;
        }
        let res = {};
        if (rooms.has(payloadObj.roomcode)) {
            let room = rooms.get(payloadObj.roomcode);
            // If this room already has this username, it's a valid rejoin
            if (room.hasUser(payloadObj.username)) {
                socket.join(payloadObj.roomcode);
                res.rejoined = true;
                res.username = payloadObj.username;
                res.failReason = "";
                // Notify just this socket of success
                socket.emit("rejoin room", JSON.stringify(res));
            } else {
                res.rejoined = false;
                res.username = "";
                res.failReason = "Username is taken";
                socket.emit("rejoin room", JSON.stringify(res));
            }
        } else {
            res.rejoined = false;
            res.username = "";
            res.failReason = "Room does not exist";
            socket.emit("rejoin room", JSON.stringify(res));
        }
    });

    //remove everybody is in and just put this on submission into room
    //socket.on("everybody in", payload => {
    //    let payloadObj;
    //    try {
    //        payloadObj = JSON.parse(payload);
    //    }
    //    catch (e) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format" }));
    //        return;
    //    }
    //    let res = {};
    //    // Get and remove a random category from this room
    //    let room = rooms.get(payloadObj.roomcode);
    //    if (!room) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Roomcode does not exist" }));
    //        return;
    //    }
    //    if (room.players.length < 2) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Room does not have enough players" }));
    //        return;
    //    }

    //    if (room.inProgress) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Game is already in progress" }));
    //        return;
    //    }
    //    io.to(payloadObj.roomcode).emit("everybody in");

    //});

    //remove start game
    //socket.on("start game", payload => {
    //    let payloadObj;
    //    try {
    //        payloadObj = JSON.parse(payload);
    //    }
    //    catch (e) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format" }));
    //        return;
    //    }
    //    let res = {};
    //    // Get and remove a random category from this room
    //    let room = rooms.get(payloadObj.roomcode);
    //    if (!room) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Roomcode does not exist, sorry!" }));
    //        return;
    //    }
        

        

    //    // TODO explore condition where all categories are played
    //    let category = room.getAndRemoveRandomCategory();
    //    res.category = category;
    //    // Pick two random sockets to be the players
    //    let selectedPlayers = room.selectPlayers();
    //    res.player1Name = selectedPlayers[0].username;
    //    res.player2Name = selectedPlayers[1].username;
    //    io.to(payloadObj.roomcode).emit("start game", JSON.stringify(res));

    //    room.resetLifetime(); //reset the game lifetime
    //    room.inProgress = true;

    //    // Broadcast an initial time changed event
    //    let initTimeChangedRes = {};
    //    initTimeChangedRes.time = room.lifetime;
    //    io.to(payloadObj.roomcode).emit(
    //        "time changed",
    //        JSON.stringify(initTimeChangedRes)
    //    );
    //    // Start the timer event
    //    let interval = setInterval(() => {
    //        let res = {};
    //        room.lifetime -= 0.5;
    //        res.time = room.lifetime;

    //        room.shiftScores();

    //        io.to(payloadObj.roomcode).emit(
    //            "time changed",
    //            JSON.stringify(res)
    //        );
    //        if (res.time <= 0) {
    //            let timeoutRes = {
    //                winner: room.getDisplayPercentage() < .5 ? 0 : 1
    //            }
    //            room.inProgress = false;
    //            io.to(payloadObj.roomcode).emit("timeout", JSON.stringify(timeoutRes));
    //            clearInterval(interval);

    //            //reset the scores of each player
    //            room.selectedPlayers[0].score.ClearScore();
    //            room.selectedPlayers[1].score.ClearScore();
    //        }
    //    }, 500);
    //});

    socket.on("enter submission", payload => {
        console.log('I have received a message');
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        }
        catch (e) {
            socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format" }));
            return;
        }
        
        let res = { //user message
            user: payloadObj.username,
            submission: payloadObj.submission
            
          
        };
        //res.user.message.UpdateString(payload.submission)

        io.to(payloadObj.roomcode).emit(
            "enter user",
            JSON.stringify(res.user));

       io.to(payloadObj.roomcode).emit(
                "enter message",
                JSON.stringify(res.submission)

        );
    });

    //socket.on("vote", payload => {
    //    let payloadObj;
    //    try {
    //        payloadObj = JSON.parse(payload);
    //    }
    //    catch (e) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format" }));
    //        return;
    //    }
    //    let room = rooms.get(payloadObj.roomcode);
    //    if (!room) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "Roomcode does not exist" }));
    //        return;
    //    }
    //    if (!("player" in payloadObj)) {
    //        socket.emit("game_error", JSON.stringify({ "game_error": "player missing from json object" }));
    //        return;
    //    }
    //    let votedPlayer = room.selectedPlayers[payloadObj.player];
    //    votedPlayer.score.AddPoint();
    //    let percentage = room.getDisplayPercentage();
    //    let res = { percentage };
    //    io.to(payloadObj.roomcode).emit("vote", JSON.stringify(res));
    //});

    socket.on("close room", (payload) => {
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        }
        catch (e) {
            socket.emit("game_error", JSON.stringify({ "game_error": "Invalid json format-" }));
            return;
        }
        let room = rooms.get(payloadObj.roomcode);
        if (!room) {
            socket.emit("game_error", JSON.stringify({ "game_error": "Roomcode does not exist-" }));
            return;
        }

        io.to(payloadObj.roomcode).emit("close room");
        // Remove socket.io room
        io.of("/").in(payloadObj.roomcode).clients((error, socketIds) => {
            if (error) {
                console.log(error);
                return;
            }
            socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(payloadObj.roomcode));
        });
        // Remove the room from the map
        rooms.delete(payloadObj.roomcode);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

/**
 * This is cute as hell way to do this but we might want a curse word filter
 * Returns a unique, random room code
 */
function getRandomRoomCode() {
    let roomCode;
    let char;

    do {
        roomCode = ""; //reset the room code

        for (let i = 0; i < 4; i = i + 1) {
            //get random ascii char from A-Z
            char = 65 + Math.floor(Math.random() * 26);

            //add it to the roomcode string
            roomCode += String.fromCharCode(char);
        }

    } while (rooms.has(roomCode)); //loop until the room code is unique

    return roomCode;
}