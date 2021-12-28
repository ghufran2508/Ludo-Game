function Hello() {
    alert('Hello');
}

const totalPlayers = 2;
const PlayerColors = ["Red","Blue"];
var currentTurn = 0;

function randomNumber() {
    let randomNum = Math.floor(Math.random()*6)+1;
    let newImage = "./Images/" + randomNum+".jpg"

    if(randomNum != 6) {
        currentTurn = currentTurn == 0 ? 1:0;
    }

    document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
    document.getElementById('diceImage').src = newImage;
}