//imported elements
const startEl = document.querySelector("#begin-btn")
const popupEl = document.querySelector("#new-game")
const inputEl = document.querySelector("#input-field")
const gameboardEl = document.querySelector("#gameboard")
const handEl = document.getElementsByClassName("cardHold")
const playerPlayed = document.querySelector("#playedCard4")
const allPlayed = document.getElementsByClassName("played")
const teamName = document.querySelector("#teamName")
const playerTeamScore = document.querySelector("#playerTeam")
const opponentTeamScore = document.querySelector("#opponentTeam")
const nextRnd = document.querySelector("#nextRnd")
const gameOverEl = document.querySelector("#game-over")
const overMessage = document.querySelector("#status")

//global variables
const allCards = new Map()
const faceToVal = new Map()
const suits = ["diamonds","clubs","hearts","spades"]
const ranks = ["ace","king","queen","jack",10,9,8,7,6,5,4,3,2]
//const ranks = ["ace","king","queen","jack",10,9]

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
inputEl.addEventListener("keypress",function(event){
    if (event.key === "Enter") {
    event.preventDefault();
    startEl.click();
  }
})

startEl.addEventListener("click", function(){
    teamName.innerHTML += inputEl.value
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
    currentPlayed = []
    for(const playedCard of allPlayed){
        playedCard.style.opacity = 0;
    }
    if(!playerFirst)
    {
        let botOnePlay = botPlay(botHands[0])
        currentPlayed.push(botOnePlay)
        document.getElementById("playedCard3").innerHTML = `<img class="card" src = images/cards/${botOnePlay}>`
        document.getElementById("playedCard3").style.opacity = 1
    }
}

function renderCards(){
    for (let index = 0; index<handEl.length; index++){
        handEl[index].innerHTML = `<img class="card" src = images/cards/${currentHand[index]}>`
    }
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
        let currCard = card.innerHTML.slice(0,card.innerHTML.length-2).substr(36)
        card.innerHTML = "";
        currentPlayed.push(currCard)
        playerSelected = true
        if(playerFirst)
        {
            let botOnePlay = botPlay(botHands[0])
            currentPlayed.push(botOnePlay)
            document.getElementById("playedCard3").innerHTML = `<img class="card" src = images/cards/${botOnePlay}>`
            document.getElementById("playedCard3").style.opacity = 1
        }
        finishTrick()
    }
}

function finishTrick(){
    let botTwoPlay = botPlay(botHands[1])
    currentPlayed.push(botTwoPlay)
    document.getElementById("playedCard2").innerHTML = `<img class="card" src = images/cards/${botTwoPlay}>`
    document.getElementById("playedCard2").style.opacity = 1
    let botThreePlay = botPlay(botHands[2])
    currentPlayed.push(botThreePlay)
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
    playerTeamScore.innerHTML = parseInt(playerTeamScore.innerHTML)+team2
    opponentTeamScore.innerHTML = parseInt(opponentTeamScore.innerHTML)+team1
    

    if(botHands[0].length>0)
        nextRnd.style.display = "block";
    else{
        gameOverEl.style.display = "block"
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
