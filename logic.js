function Hello(id) {
    var copyThis = document.getElementById(id).parentElement;
    var copied = document.getElementById('cell_19');

    copied.innerHTML = copyThis.innerHTML;
    copyThis.innerHTML = "";
}

function startGame() {
    // document.getElementById('red1').
}

const totalPlayers = 2;
const PlayerColors = ["Red","Blue"];
var currentTurn = 0;
const safeStates = document.getElementById('safe');

function randomNumber() {
    let randomNum = Math.floor(Math.random()*6)+1;
    let newImage = "./Images/" + randomNum+".jpg"

    if(randomNum != 6) {
        currentTurn = currentTurn == 0 ? 1:0;
    }

    document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
    document.getElementById('diceImage').src = newImage;
}