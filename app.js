const { Socket } = require('socket.io');

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const port = 8080;
const wordPage = __dirname+ '/public/js/dico.json'
let dico = require(wordPage);
let gameWords=[];
let type=[8,8,8,1];
/**
 * @type {Socket}
 */
const io = require('socket.io')(http);

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/accueil.html'));
});

app.get('/games/createRoom', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/games/createRoom.html'));
});
app.get('/words', (req, res) => {
    res.sendFile(__dirname + '/public/assets/scripts/words.js')
})
/*app.get('/games/lobby', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/games/lobby.html'));
});*/

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

let rooms = [];
let playername=[];

io.on('connection', (socket) => {
    console.log(`[connection] ${socket.id}`);

    socket.on('playerData', (player) => {
        console.log(`[playerData] ${player.username}`);
        playername.push(player.username);
        console.log(playername);
        let room = null;

        if (!player.roomId) {
            room = createRoom(player);
            console.log(`[create room ] - ${room.id} - ${player.username}`);
        } else {
            room = rooms.find(r => r.id === player.roomId);

            if (room === undefined) {
                return;
            }

            player.roomId = room.id;
            room.players.push(player);
        }

        socket.join(room.id);

        io.to(socket.id).emit('join room', room.id);

        if (room.players.length === 4   ) {
            
            for(let i = 0; i < 25; i++){
                let randomNumber = Math.floor(Math.random() * dico.length);
                let randomWord = dico[randomNumber];
                gameWords.push(randomWord);
            }
            console.log(gameWords);
            io.to(room.id).emit('start game', room.players,gameWords);
        
        }
    });

    socket.on('get rooms', () => {
        io.to(socket.id).emit('list rooms', rooms);
    });

    socket.on('disconnect', () => {
        console.log(`[disconnect] ${socket.id}`);
        let room = null;

        rooms.forEach(r => {
            r.players.forEach(p => {
                if (p.socketId === socket.id && p.host) {
                    room = r;
                    rooms = rooms.filter(r => r !== room);
                }
            })
        })
    });
});

function createRoom(player) {
    const room = { id: roomId(), players: [] };

    player.roomId = room.id;

    room.players.push(player);
    rooms.push(room);

    return room;
}

function roomId() {
    return Math.random().toString(36).substr(2, 9);
}
