const { Socket } = require('socket.io');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
// const { PORT = 3000, LOCAL_ADDRESS = '0.0.0.0' } = process.env
const http = require('http');
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

const path = require('path');
const wordPage = __dirname + '/public/js/dico.json'
let dico = require(wordPage);
let couleur = [];
/**
 * @type {Socket}
 */
const io = require('socket.io')(server);

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

let rooms = [];
let playername = [];
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


        socket.on('send_secret', (secret, roomID) => {
            console.log(secret);
            io.to(roomID).emit('actualize_secret', secret);
        });

        socket.on('pick_card', (card, roomID) => {
            console.log(card);
            io.to(roomID).emit('actualize_card', card);
        });

        socket.on('send_role', (id, username, roomID) => {
            io.to(roomID).emit('actualize_role', id, username);
            room.nb_player++;
            console.log(room.nb_player)
            if (room.nb_player == 4) {
                room.nb_player = 0
                io.to(roomID).emit('changeTeamTurn', 1);
            }
        });

        socket.on('changeTurn', (teamNumber, roomID) => {
            io.to(roomID).emit('changeTeamTurn', teamNumber)
        })

        socket.on('winner', (teamNumber, roomID) => {
            io.to(roomID).emit('winner', (teamNumber))
            room.players.length = 0;
        })

        socket.on('replay', roomID => {
            room.nb_player++
            console.log("nombre de joueurs" + room.nb_player);
            io.to(roomID).emit('replay', room.nb_player)
            if (room.nb_player == 4) {
                room.nb_player = 0
                initGame(room)
                io.to(roomID).emit('initGame')
            }
        })

        socket.on('quit', roomID => {

        })


        //Première vérif
        if (room.players.length === 4) {

            io.to(room.id).emit('makeLobbyVisible')
            let type = [7, 9, 8, 1]
            let randomType = ""
            let gameWords = [];
            let randomNumber = 0
            let randomWord = "not_valid"

            for (let i = 0; i < 25; i++) {
                do {
                    randomNumber = Math.floor(Math.random() * dico.length);
                    randomWord = dico[randomNumber];
                } while (gameWords.indexOf(randomWord) != -1);

                gameWords.push(randomWord);
                randomType = Math.floor(Math.random() * 4)

                while (!type[randomType]) { randomType = Math.floor(Math.random() * 4) }
                couleur[i] = randomType
                type[randomType]--
            }
            console.log(gameWords)
            console.table(couleur)
            io.to(room.id).emit('start game', gameWords, couleur);


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

function initGame(room) {
    let type = [8, 9, 7, 1]
    let randomType = ""
    let gameWords = [];
    let randomNumber = 0
    let randomWord = "not_valid"

    for (let i = 0; i < 25; i++) {
        do {
            randomNumber = Math.floor(Math.random() * dico.length);
            randomWord = dico[randomNumber];
        } while (gameWords.indexOf(randomWord) != -1);

        gameWords.push(randomWord);
        randomType = Math.floor(Math.random() * 4)

        while (!type[randomType]) { randomType = Math.floor(Math.random() * 4) }
        couleur[i] = randomType
        type[randomType]--
    }
    console.log(gameWords)
    console.table(couleur)
    io.to(room.id).emit('start game', gameWords, couleur);
}



function createRoom(player) {
    const room = { id: roomId(), players: [], nb_player: 0 };

    player.roomId = room.id;

    room.players.push(player);
    rooms.push(room);

    return room;
}

function roomId() {
    return Math.random().toString(36).substring(2, 9);
}
