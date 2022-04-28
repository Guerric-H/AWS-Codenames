const player = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    turn: false,
    team:"",
    role:"",
    
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

const restartArea = document.getElementById('restart-area');
const waitingArea = document.getElementById('waiting-area');

const roomsCard = document.getElementById('rooms-card');
const roomsList = document.getElementById('rooms-list');

const turnMsg = document.getElementById('turn-message');
const linkToShare = document.getElementById('link-to-share');

let ennemyUsername = "";
let couleur12=[]

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
    linkToShare.innerHTML = `<a href="${window.location.href}?room=${player.roomId}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
});


socket.on('start game', (players,gameWords,couleur) => {
    startGame(gameWords);
    couleur12=couleur;
});

function startGame(gameWords,couleur) {
    
    let lobby1= document.getElementById('lobygame');
    let crt = document.getElementById('tohide')
    lobby1.style.visibility="visible";
    crt.style.visibility="hidden";
    //affichage des mots
    
    for(let i = 0; i < 25; i++){
        let y = document.getElementById(i)
        y.textContent = gameWords[i]
    }
    //affichage de couleur
    
    
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
const jointeam =function(id){
    let role=document.getElementById(id)
   if(id=="espion-button1"){
       player.team=1
       player.role=0
       role.innerHTML+=player.username
   }else if(id=="espion-button2"){
    player.team=2
    player.role=0
    role.innerHTML+=player.username
}else if(id=="agent-button1"){
    player.team=1
    player.role=1
    role.innerHTML+=player.username
}else if(id=="agent-button2"){
    player.team=2
    player.role=1
    role.innerHTML+=player.username
}
else console.log("error joinTeam")
console.log(player.username+player.role+player.team)
if(player.role==0){
    makeAllVisible();
}
}
const makeAllVisible=function() {
    
    for(let i = 0; i < 25; i++) {
        let GameP = document.getElementById(i);
        if(couleur12[i] == 1){
            GameP.removeAttribute("cartes")
            GameP.setAttribute("class","cartesRouge")
            
        }
        if(couleur12[i] == 2){
            GameP.removeAttribute("cartes")
            GameP.setAttribute("class","cartesBleu")
        }
        if(couleur12[i] == 3){
            GameP.removeAttribute("cartes")
            GameP.setAttribute("class","carteNoire")
        }
    }
}
    