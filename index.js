//imported elements
const startEl = document.querySelector("#begin-btn")
const popupEl = document.querySelector("#new-game")
const inputEl = document.querySelector("#input-field")
const gameboardEl = document.querySelector("#gameboard")
const hand = document.querySelector("#hand")
const playerPlayed = document.querySelector("#playedCard4")
const allPlayed = document.getElementsByClassName("played")
const teamName = document.querySelector("#teamName")
const playerTeamScore = document.querySelector("#playerTeam")
const opponentTeamScore = document.querySelector("#opponentTeam")
const nextRnd = document.querySelector("#nextRnd")
const gameOverEl = document.querySelector("#game-over")
const overMessage = document.querySelector("#status")
const rulesOpenBtn = document.querySelector("#open-rules")
const rulesCloseBtn = document.querySelector("#close-rules")
const rules = document.querySelector("#rules")
const newGame = document.querySelector("#new-game")
const scoreboard = document.querySelector("#scoreboard")

//global variables
const allCards = new Map()
const faceToVal = new Map()
const suits = ["diamonds","clubs","hearts","spades"]
const ranks = ["ace","king","queen","jack",10,9,8,7,6,5,4,3,2]

let playerFirst = false;
let currDeck = []
let usedDeck = []
let currentHand = []
let botHands = [[],[],[]]
let currentPlayed = []
let roundScore = [0,0]
let playerSelected = false

//pregame preparation
for(const suit of suits){
    for(const rank of ranks){
        allCards.set(`${rank}_of_${suit}.png`,[rank,suit])
        currDeck.push(`${rank}_of_${suit}.png`)
    }
}
faceToVal.set("ace",11)
faceToVal.set("king",10)
faceToVal.set("queen",10)
faceToVal.set("jack",10)

//main.exe

rulesOpenBtn.addEventListener("click", function() {
    rules.style.display = "block"
    newGame.style.display = "none"
})

rulesCloseBtn.addEventListener("click", function() {
    rules.style.display = "none"
    newGame.style.display = "block"
})

inputEl.addEventListener("keypress",function(event){
    if (event.key === "Enter") {
    event.preventDefault();
    startEl.click();
  }
})

startEl.addEventListener("click", function(){
    scoreboard.style.display = "block"
    if(inputEl.value != "")
        teamName.innerHTML += inputEl.value
    else
        teamName.innerHTML += "Player"
    popupEl.style.display = "none"
    gameboardEl.style.display = "block"
    playGame()
})

//helper functions
function playGame(){
    playerTeamScore.innerHTML = 0
    opponentTeamScore.innerHTML = 0
    currDeck = currDeck.concat(usedDeck)
    dealCards()
    renderCards()
    trick()
}

function trick(){
    playerSelected = false
    currentPlayed = [0,0,0,0]
    for(const playedCard of allPlayed){
        playedCard.style.opacity = 0;
    }
    if(!playerFirst)
    {
        let botOnePlay = botPlay(botHands[0])
        currentPlayed[0] = botOnePlay
        document.getElementById("playedCard3").innerHTML = `<img class="card" src = images/cards/${botOnePlay}>`
        document.getElementById("playedCard3").style.opacity = 1
    }
}

function renderCards(){
    hand.style.opacity = 1
    let cardsRender = ""
    for (let index = 0; index<currentHand.length; index++){
        cardsRender += `
        <div class="cardHold" onclick="selectCard(this)">
            <img class="card" src = images/cards/${currentHand[index]}>
        </div>
        `
    }
    hand.innerHTML = cardsRender
}

function dealCards(){
    currentHand = []
    botHands = [[],[],[]]
    for(let count = 0; count<3; count++){
        for(let counter = 0; counter<5; counter++){
            let cardIndex = Math.floor(Math.random()*currDeck.length)
            botHands[count].push(currDeck[cardIndex])
            usedDeck.push(currDeck[cardIndex])
            currDeck.splice(cardIndex,1)
        }
    }
    for(let counter = 0; counter<5; counter++){
        let cardIndex = Math.floor(Math.random()*currDeck.length)
        currentHand.push(currDeck[cardIndex])
        usedDeck.push(currDeck[cardIndex])
        currDeck.splice(cardIndex,1)
    }
}

function botPlay(botHand){
    let index = Math.floor(Math.random()*botHand.length)
    let botCard = botHand[index]
    botHand.splice(index,1)
    return botCard
}

function selectCard(card){
    if(!playerSelected)
    {
        playerPlayed.innerHTML=card.innerHTML
        playerPlayed.style.opacity = 1
        let currCard = card.innerHTML.slice(49,-11)
        currentPlayed[1]=currCard
        playerSelected = true
        card.remove()
        if(playerFirst)
        {
            let botOnePlay = botPlay(botHands[0])
            currentPlayed[0]=botOnePlay
            document.getElementById("playedCard3").innerHTML = `<img class="card" src = images/cards/${botOnePlay}>`
            document.getElementById("playedCard3").style.opacity = 1
        }
        finishTrick()
    }
}

function finishTrick(){
    let botTwoPlay = botPlay(botHands[1])
    currentPlayed[2]=botTwoPlay
    document.getElementById("playedCard2").innerHTML = `<img class="card" src = images/cards/${botTwoPlay}>`
    document.getElementById("playedCard2").style.opacity = 1
    let botThreePlay = botPlay(botHands[2])
    currentPlayed[3] = botThreePlay
    document.getElementById("playedCard1").innerHTML = `<img class="card" src = images/cards/${botThreePlay}>`
    document.getElementById("playedCard1").style.opacity = 1
    determineWinner()
}

function determineWinner(){
    let playedByRank = []
    for(const card of currentPlayed){
        playedByRank.push(allCards.get(card)[0])
    }
    let rankVals = []
    for(let rank of playedByRank){
        if(faceToVal.has(rank))
            rankVals.push(faceToVal.get(rank))
        else
            rankVals.push(rank)
    }
    const team1 = rankVals[0]+rankVals[2]
    const team2 = rankVals[1]+rankVals[3]
    if(team1>team2)
        opponentTeamScore.innerHTML = parseInt(opponentTeamScore.innerHTML)+1
    if(team2>team1)
        playerTeamScore.innerHTML = parseInt(playerTeamScore.innerHTML)+1
        
    if(botHands[0].length>0)
        nextRnd.style.display = "block";
    else{
        gameOverEl.style.display = "block"
        hand.style.opacity = 0
        if (parseInt(playerTeamScore.innerHTML)>parseInt(opponentTeamScore.innerHTML))
        {
            overMessage.innerHTML = "YOU WIN!"
            overMessage.style.color = "gold";
        }
        else if (parseInt(playerTeamScore.innerHTML)<parseInt(opponentTeamScore.innerHTML))
        {
            overMessage.innerHTML = "YOU LOSE!"
            overMessage.style.color = "red";
        }
        else
            overMessage.innerHTML = "TIE"
    }
}

nextRnd.addEventListener("click",function(){
    playerFirst = !playerFirst
    trick()
    nextRnd.style.display = "none"
})

document.onkeypress = function (event) {
    if(event.key === " " || event.key === "Enter")
        if(nextRnd.style.display === "block")
            nextRnd.click()
    if(event.key === "Enter")
        if(gameOverEl.style.display === "block")
        {
            gameOverEl.style.display = "none"
            playGame()
        }
}
