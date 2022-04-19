let dico = require('./dico.json');


class Game {
    constructor(){
        this.redScore = 0
        this.blueScore = 0
        this.redTurn = true
        this.blueTurn = false
        this.cards = []
        this.gameWords = []
        this.Type = [8,8,8,1]
    }

    //Récupère les mots 
    gettingWords(){
        for(let i = 0; i < 25; i++){
            let randomNumber = Math.floor(Math.random() * dico.length)
            let randomWord = dico[randomNumber]
            this.gameWords.push(randomWord)
        }
    }

    //Initialise une partie vide
    init(){
        this.columnPlateau = new Array(5)
        let randomType
        for(let i = 0; i < 5; i++){
            this.cards[i] = new Array(5)
            for(let j = 0; j < 5; j++){
                this.cards[i][j] = 0
            }
        }
    }

    //Remplie les mots et les couleurs
    initPlateau(){
        let randomType
        this.init()
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                randomType = Math.floor(Math.random() * 4)
                while(!this.Type[randomType]) {randomType = Math.floor(Math.random() * 4)}
                this.cards[i][j] = randomType
                this.Type[randomType] --
            }
        }
        this.gettingWords()
        
    }

}



module.exports = Game