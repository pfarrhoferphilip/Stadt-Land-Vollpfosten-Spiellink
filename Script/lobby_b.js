/* SERVER ADRESS =>*/
const address = "localhost:8080";
const Protocol = "ws";

let room_code;
let username = "Gast";
let profile_pic;
let players_in_room = [];
let player_id = -1;
let game_speed = "normal";
let category = "standard"

//CONNECT TO Server.php
console.log(`Establishing connection to Websocket: ${Protocol}://${address}`)
const socket = new WebSocket(`${Protocol}://${address}`);
socket.onopen = function(event) {
    console.log('WebSocket is connected.');

    //sendServerMessage(`${localStorage.getItem("username")} has joined the Channel.`);
    getGameOptions();

};


setGameoptions("normal");
setCategory("standard");

//HANDLE MESSAGES SENT FROM SERVER
socket.onmessage = function(event) {
    console.log(event.data);

    //0 = set room code
    //1 = Player joined Room
    //2 = Get all Players in current Room
    //3 = Get Player ID
    //4 = Server reboot check
    //5 = Rejoin Lobby
    //6 = Get if room exists
    //7 = Load Game
    //8 = Error on join
    //9 = Get is_host

    let output = event.data.split(';');
    if (output[0] == 0) {
        room_code = output[1];
        localStorage['room_code'] = room_code;
        setUsername(username);
    } else if (output[0] == 1) {
        loadPlayers();
    } else if (output[0] == 2) {
        players_in_room = JSON.parse(output[1]);
        console.log(players_in_room);
        displayPlayers();
    } else if (output[0] == 3) {
        player_id = output[1];
        localStorage["player_id"] = output[1];

        //JOIN ROOM VIA URL
        joinRoomViaURL();

    } else if (output[0] == 4) {
        //REBOOT CHECK
        if (localStorage["last_start_time"]) {
            if (localStorage["last_start_time"] < output[1]) {
                username = localStorage['username'];
                localStorage.removeItem('player_id');
                console.log("Server restarted...")
            }
        } else {
            username = localStorage['username'];
            localStorage.removeItem('player_id');
            console.log("Client wasn't online before...")
        }
        localStorage["last_start_time"] = new Date().getTime();




        if (localStorage['player_id']) {
            player_id = localStorage.getItem("player_id");
        }

        if (localStorage['username']) {
            username = localStorage.getItem("username");
        }

        if (localStorage['image_id']) {
            profile_pic = localStorage['image_id'];
        } else {
            profile_pic = "character-1.jpg";
        }


        socket.send("6;" + player_id + ";" + profile_pic);


    } else if (output[0] == 5) {
        if (localStorage['room_code']) {
            room_code = localStorage['room_code'];

            socket.send("7;" + window.location.href.split('?')[1]);
        } else {
            joinRoomViaURL();
        }
    } else if (output[0] == 6) {
        if (output[1] == true) {
            //room exists
            joinRoomViaURL();

        } else {
            //room does not exist
            joinRoom(room_code);
        }
    } else if (output[0] == 7) {
        //Load Game
        window.open("./../Sites/game.html", "_self");
    } else if (output[0] == 8) {
        //ERROR ON JOIN
        window.open("./../Sites/error_page.html", "_self");
    } else if (output[0] == 9) {
        console.log(output[1]);
        if (output[1] == true)
            createStartButton();
    } else {

        //console.log(event.data);

        /*document.getElementById("output").innerHTML += `
            <p>${event.data}</p>
        `;*/

    }



};

function joinRoomViaURL() {
    splited_url = window.location.href.split('?');
    if (splited_url[1] && splited_url[1] != "createRoom") {
        joinRoom(splited_url[1]);
        console.log("joining room via URL...");
    } else if (splited_url[1] == "createRoom") {
        createRoom();
    } else {
        console.log("no roomcode in URL...");
    }
}

/*PROTOCOL LIST
0: Join Room [room_code; username]
1: Send Ready Status [room_code; ready_status(true or false)]
2: Set Username [room_code; new username]
3: Create Room [username]
4: Leave Rooms
5: Get all Players in Room
6: Connect to Websocket
7: Check if Room exists [room_code]
8: Load into Game
*/

function loadGame() {
    socket.send("8;" + room_code + ";" + game_speed + ";" + category);
}

//DISPLAY ALL PLAYERS IN CURRENT ROOM
function displayPlayers() {
    console.log("Displaying Players...")
    let html_code = "";
    for (let i = 0; i < Object.keys(players_in_room).length; i++) {
        console.log(players_in_room[Object.keys(players_in_room)[i]]);
        //PLAYER IN LOBBY
        if (players_in_room[Object.keys(players_in_room)[i]].is_in_game == false) {
            html_code += `
            <div class="player">
                <img class="player-image" src="../images/characters/${players_in_room[Object.keys(players_in_room)[i]].profile_pic}" alt="char1">
                <p>${players_in_room[Object.keys(players_in_room)[i]].username}</p>
            </div>
            `;
            //PLAYER IS IN GAME
        } else {
            html_code += `
            <div class="player">
                <img class="player-image" src="../images/characters/${players_in_room[Object.keys(players_in_room)[i]].profile_pic}" alt="char1">
                <p style="color: rgba(0, 0, 0, 0.7);">${players_in_room[Object.keys(players_in_room)[i]].username}</p>
            </div>
            `;
        }

    }
    document.getElementById("lobby-players-box-players").innerHTML = html_code;
    document.getElementById("room-code").innerHTML = room_code;

    createButtonForHost();
}

function createButtonForHost() {
    socket.send("12");
}

function createStartButton() {
    document.getElementById("start-button-container").innerHTML = `<button onclick="loadGame()" type="submit" id="startButton">Start</button>`;
}

//CREATE A ROOM
function createRoom() {
    socket.send("3;" + username);
}

//JOIN A ROOM
function joinRoom(code) {
    socket.send("0;" + code + ";" + username);
}

function leaveRoom() {
    socket.send("4");
}

function loadPlayers() {
    socket.send("5;" + room_code);
}

//READY UP AND NOTIFY ALL OTHER PLAYERS
function setReadyStatus() {
    let message = "1;" + room_code + ";" + document.getElementById("message").value;
    socket.send(message);
}

//SET USERNAME AND NOTIFY ALL OTHER PLAYERS
function setUsername(name) {
    //username = document.getElementById("username").value;
    username = name;
    localStorage.setItem("username", username);
    socket.send("2;" + player_id + ";" + room_code + ";" + username)
}

function copyRoomCode() {
    navigator.clipboard.writeText(window.location.href.split("?")[0] + "?" + room_code);
    alert("Room Code copied to clipboard.");
}


//SET GAMEOPTIONS
function setGameoptions(kind) {

    let version = kind;   

    console.log(version);

    let card;
    switch (version) {
        case "normal":
            card = document.getElementsByClassName('card')[0];
            game_speed = "normal";
            break;
        case "schnell":
            card = document.getElementsByClassName('card')[1];
            game_speed = "schnell";
            break;
        case "senioren":
            card = document.getElementsByClassName('card')[2];
            game_speed = "senioren";
            break;
        default:
            break;
    }
    
    document.getElementById("card-normal").style.borderColor = "#fff";
    document.getElementById("card-schnell").style.borderColor = "#fff";
    document.getElementById("card-senioren").style.borderColor = "#fff";
    document.getElementById("card-" + version).style.borderColor = "#4a8a11";
    
}
//SET CATEGORY
function setCategory(kind) {
    
    let version = kind;
    
    console.log(version);

    let category_e;
    switch (version) {
        case "standard":
            category_e = document.getElementsByClassName('category')[0];
            category = "standard";
            break;
        case "sport":
            category_e = document.getElementsByClassName('category')[1];
            category = "sport";
            break;
        case "rotlicht":
            category_e = document.getElementsByClassName('category')[2];
            category = "rotlicht";
            break;
        case "lask":
            category_e = document.getElementsByClassName('category')[3];
            category = "lask";
            break;
        case "rennsport":
            category_e = document.getElementsByClassName('category')[4];
            category = "rennsport";
            break;
        case "haushalt":
            category_e = document.getElementsByClassName('category')[5];
            category = "haushalt";
            break;
        case "tierliebhaber":
            category_e = document.getElementsByClassName('category')[6];
            category = "tierliebhaber";
            break;
        default:
            break;
    }

    
    document.getElementById("category-standard").style.borderColor = "#fff";
    document.getElementById("category-sport").style.borderColor = "#fff";
    document.getElementById("category-rotlicht").style.borderColor = "#fff";
    document.getElementById("category-lask").style.borderColor = "#fff";
    document.getElementById("category-rennsport").style.borderColor = "#fff";
    document.getElementById("category-haushalt").style.borderColor = "#fff";
    document.getElementById("category-tierliebhaber").style.borderColor = "#fff";
    document.getElementById("category-" + version).style.borderColor = "#4a8a11";

    
}