const totalPlayers = 2;
const PlayerColors = ["Red","Blue"];
var currentTurn = 0;
const safeStates = document.getElementById('safe');
const RedStart = 19;
const BlueStart = 55;
var diceNumber = -1;

function randomNumber() {
    diceNumber = Math.floor(Math.random()*6)+1;
    let newImage = "./Images/" + diceNumber +".jpg"

    document.getElementById('diceImage').src = newImage;
}

function MovePawn(id) {
    if(diceNumber == -1) return;
    if(id[0] == 'r' && currentTurn == 1) return;

    var copyThis = document.getElementById(id).parentElement;
    let start = 0;

    if(id[0] == 'r') {
        start = RedStart;
    }
    else {
        start = BlueStart;
    }

    if(copyThis.classList.contains('block')) {
        let copiedTo = document.getElementById('cell_'+start);
        copiedTo.innerHTML = copyThis.innerHTML;
        copyThis.innerHTML = "";
    }
    else {
        let position = parseInt(copyThis.id.split("_")[1]);
        position += diceNumber;

        let copiedTo = document.getElementById('cell_'+position);
        copiedTo.innerHTML = copyThis.innerHTML;
        copyThis.innerHTML = "";
    }

    if(diceNumber != 6) {
        currentTurn = currentTurn == 0 ? 1:0;
    }
    document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
    diceNumber = -1;
}