const player = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    turn: false,
    team: "",
    role: "",

};

const socket = io();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('room');

if (roomId) {
    document.getElementById('start').innerText = "create new room";
    document.getElementById('start').disabled = true;
}

const usernameInput = document.getElementById('username');

const gameCard = document.getElementById('game-card');
const userCard = document.getElementById('user-card');

const InputButton = document.getElementById('send_secret');


const restartArea = document.getElementById('restart-area');
const waitingArea = document.getElementById('waiting-area');

const roomsCard = document.getElementById('rooms-card');
const roomsList = document.getElementById('rooms-list');

const turnMsg = document.getElementById('turn-message');
const linkToShare = document.getElementById('link-to-share');

let sr = document.getElementById('score_rouge');
let sb = document.getElementById('score_bleu');
let scoreRouge = 8;
let scoreBleu = 8;

let carteRetournee = 0;

let ennemyUsername = "";
let couleur12 = []

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if (rooms.length > 0) {
        rooms.forEach(room => {
            if (room.players.length !== 4) {
                html += `<li class="list-group-item d-flex justify-content-between">
                            <p class="p-0 m-0 flex-grow-1 fw-bold">Salon de ${room.players[0].username} - ${room.id}</p>
                            <button class="btn btn-sm btn-success join-room" data-room="${room.id}">Rejoindre</button>
                        </li>`;
            }
        });
    }

    if (html !== "") {
        roomsCard.classList.remove('d-none');
        roomsList.innerHTML = html;

        for (const element of document.getElementsByClassName('join-room')) {
            element.addEventListener('click', joinRoom, false)
        }
    }
});

$("#form").on('submit', function (e) {
    e.preventDefault();

    player.username = usernameInput.value;

    if (roomId) {
        player.roomId = roomId;
    } else {
        player.host = true;
        player.turn = true;
    }

    player.socketId = socket.id;

    userCard.hidden = true;
    waitingArea.classList.remove('d-none');
    roomsCard.classList.add('d-none');

    socket.emit('playerData', player);
});



socket.on('join room', (roomId) => {
    player.roomId = roomId;
    linkToShare.innerHTML = `<a href="${window.location.href}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
});


socket.on('start game', (players, gameWords, couleur) => {
    startGame(gameWords);
    couleur12 = couleur;
});

socket.on('actualize_secret', (secret) => {
    if (!isNumeric(secret.nb_word)) {
        console.log("Invalid number choice (not a positive number)");
        return;
    }

    document.getElementById('keyword_result').textContent = secret.word;
    document.getElementById('number_result').textContent = secret.nb_word;
    agentTurn(secret.nb_word)
});

socket.on('actualize_card', (cardID) => {

    let cd = document.getElementById(cardID)

    if (couleur12[cardID] == 1) {
        cd.removeAttribute("cartes")
        cd.setAttribute("class", "cartesRouge")
        scoreRouge--
        sr.innerHTML = scoreRouge
        alert(scoreRouge)
    }
    else if (couleur12[cardID] == 2) {
        cd.removeAttribute("cartes")
        cd.setAttribute("class", "cartesBleu")
        scoreBleu--
        sb.innerHTML = scoreBleu
        alert(scoreBleu)
    }
    else if (couleur12[cardID] == 3) {
        cd.removeAttribute("cartes")
        cd.setAttribute("class", "carteNoire")
    }
});

socket.on('actualize_role', (id, username) => {
    let role = document.getElementById(id);
    role.textContent = username;
    role.disabled = true;
});

socket.on('changeTeamTurn', (teamNumber) => {
    if(player.team == teamNumber){
        player.turn = true;
    }
    else{
        player.turn = false;
    }
    spyTurn()
});

function spyTurn(){
    if(player.role == 0 && player.turn == true){
        document.getElementById("send_secret").disabled = false;
    }
}

function agentTurn(nb){
    if(player.role == 1 && player.turn == true){
        for (let i = 0; i < 25; i++) {
            let GameP = document.getElementById(i);
            GameP.disabled = false;
        }
    }
}

function startGame(gameWords, couleur) {

    let lobby1 = document.getElementById('lobbygame');
    let crt = document.getElementById('tohide')
    lobby1.style.visibility = "visible";
    crt.style.visibility = "hidden";


    for (let i = 0; i < 25; i++) {
        let y = document.getElementById(i)
        y.textContent = gameWords[i]
        y.disabled = true;
    }

    InputButton.disabled = true;
}

const joinRoom = function () {
    if (usernameInput.value !== "") {
        player.username = usernameInput.value;
        player.socketId = socket.id;
        player.roomId = this.dataset.room;

        socket.emit('playerData', player);

        userCard.hidden = true;

        waitingArea.classList.remove('d-none');
        roomsCard.classList.add('d-none');
    }
}
const jointeam = function (id) {
    let role = document.getElementById(id);
    let clicked = 0
    if(player.team == 1 || player.team == 2) clicked = 1

    if (id == "espion-button1") {
        player.team = 1;
        player.role = 0;
        role.textContent = player.username;
        document.getElementById("espion-button2").disabled = true;
        document.getElementById("agent-button2").disabled = true;
        document.getElementById("agent-button1").disabled = true;

    } else if (id == "espion-button2") {
        player.team = 2;
        player.role = 0;
        role.textContent = player.username;
        document.getElementById("espion-button1").disabled = true;
        document.getElementById("agent-button2").disabled = true;
        document.getElementById("agent-button1").disabled = true;


    } else if (id == "agent-button1") {
        player.team = 1
        player.role = 1
        role.textContent = player.username
        document.getElementById("espion-button2").disabled = true;
        document.getElementById("espion-button1").disabled = true;
        document.getElementById("agent-button2").disabled = true;


    } else if (id == "agent-button2") {
        player.team = 2
        player.role = 1
        role.textContent = player.username
        document.getElementById("espion-button2").disabled = true;
        document.getElementById("espion-button1").disabled = true;
        document.getElementById("agent-button1").disabled = true;
    }
    else console.log("error joinTeam")
    console.log(player.username + player.role + player.team)
    if (player.role == 0) {
        makeAllVisible();
    }
    socket.emit('send_role', id, player.username, clicked);
}

const makeAllVisible = function () {

    for (let i = 0; i < 25; i++) {
        let GameP = document.getElementById(i);
        GameP.disabled = false;
        if (couleur12[i] == 1) {
            GameP.removeAttribute("cartes")
            GameP.setAttribute("class", "cartesRouge")
        }
        if (couleur12[i] == 2) {
            GameP.removeAttribute("cartes")
            GameP.setAttribute("class", "cartesBleu")
        }
        if (couleur12[i] == 3) {
            GameP.removeAttribute("cartes")
            GameP.setAttribute("class", "carteNoire")
        }
        GameP.disabled = true;
    }
}

function reply_click(cardID) {

    //Permet de récupérer l'élément via son ID propre
    let cd = document.getElementById(cardID)
    carteRetournee++
    //Permet de changer la classe cartes (neutre) par la classe de couleur qu'on veut. Il y a cartesBleu, cartesRouge et carteNoire
    if (couleur12[cardID] == 1) {
        cd.removeAttribute("cartes")
        cd.setAttribute("class", "cartesRouge")
        scoreRouge--
        sr.innerHTML = scoreRouge
    }
    else if (couleur12[cardID] == 2) {
        cd.removeAttribute("cartes")
        cd.setAttribute("class", "cartesBleu")
        scoreBleu--
        sb.innerHTML = scoreBleu
    }
    else if (couleur12[cardID] == 3) {
        cd.removeAttribute("cartes")
        cd.setAttribute("class", "carteNoire")
    }

    socket.emit('pick_card', cardID);

    let secret_nb = document.getElementById('number_result').textContent
    let nb = parseInt(secret_nb, 10)
    if(carteRetournee == nb){
        for (let i = 0; i < 25; i++) {
            let GameP = document.getElementById(i);
            GameP.disabled = true;
        }
        carteRetournee = 0
    }

}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function send_secret() {
    let keyword = document.getElementById('keyword').value;
    let number = document.getElementById('number_keyword').value;

    if (!isNumeric(number)) {
        console.log("Invalid number choice (not a positive number)");
        return;
    }

    let secret = {
        word: keyword,
        nb_word: number
    };

    document.getElementById('keyword_result').textContent = secret.word;
    document.getElementById('number_result').textContent = secret.nb_word;

    socket.emit('send_secret', secret);
    document.getElementById("send_secret").disabled = true;
}
