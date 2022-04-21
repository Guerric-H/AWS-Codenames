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

    
    //Remplie les mots et les couleurs
    initPlateau(){
        let randomType
        for(let i = 0; i < 25; i++){
            randomType = Math.floor(Math.random() * 4)
                while(!this.Type[randomType]) {randomType = Math.floor(Math.random() * 4)}
                this.cards[i] = randomType
                this.Type[randomType] --
        }
        this.gettingWords()
        
    }


    //Permet de montrer quelle équipe peut jouer et les scores
    showTurn(){
        if(this.redTurn && this.blueTurn){
            console.log('error')
            return
        }
        else if(this.redTurn)
            console.log('Red turn')
        else 
            console.log('Blue turn')
    }
    showScore(){
        console.log('Red score : ' + this.redScore)
        console.log('Blue score : ' + this.blueScore)
    }

    //Effectue un tour pour l'agent
    oneAgentTurn(nbTour, cardType){
        
        if(cardType == 1) //Si la carte est rouge, l'équipe rouge gagne un point
            this.redScore++
        else if(cardType == 2) //Si la carte est bleu, l'équipe bleu gagne un point
            this.blueScore++
        else if(cardType ==3) //Si la carte est noire, victoire de l'équipe adverse
            if(this.redTurn)
                victoire(2)
            else
                victoire(1)
    
        //Si on a retourné le nombre de carte donné, si on a retourné une carte neutre ou qui n'est pas de notre équipe
        //On donne la main à l'autre équipe
        if(  (nbTour == 1) || (this.redTurn && cardType == 2) || (this.blueTurn && cardType == 1) || (cardType == 0)  ){
            if(this.redTurn){
                this.redTurn = false
                this.blueTurn = true 
            }
            else{
                this.redTurn = true
                this.blueTurn = false
            }
        }
    }

    //Boolean pour vérifier s'il y a victoire. Si oui, on lance la fonction de victoire, sinon, on continue
    verifVictoire(){
        if(this.redScore == 8){
            victoire(1)
            return true
        }
        else if (this.blueScore == 8){
        victoire(2)
        return true
        }
        else return false
    }

}

//En cours, renvoie la couleur de la carte via l'ID de la carte
function getCardByID(cardID){
    return cardID 
}

//En cours, affichage de fin pour la victoire d'une équipe
function victoire(numTeam){
    if(numTeam == 1)
        console.log('Les rouges ont gagné')
    else if(numTeam == 2)
        console.log('Les bleus ont gagné')
    else
        console.log('ERR : Victoire pour aucune equipe')
}



//Permet de tester les fonctions pour une partie aléatoire
function test(){
    //Initialisation d'une partie
    let g1 = new Game()
    g1.initPlateau()

    //On fixe le nombre de tour
    nbTour = 30

    
    while(nbTour){
        console.log('Il reste ' + nbTour + ' tour')
        g1.showTurn()
        let cardType = Math.floor(Math.random() * 4)  //Permet d'avoir une couleur aléatoire, sera remplacé par getCardByID
        console.log('La carte est ' + cardType)
        g1.oneAgentTurn(nbTour, cardType)
        if(g1.verifVictoire() || cardType == 3)
            break
        else
            g1.showScore()
        console.log('---')
        nbTour --
    }
}

