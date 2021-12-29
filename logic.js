const totalPlayers = 2;
const PlayerColors = ["Red","Blue"];
var PlayerStatus = [false, false];
const RedHome = [19,13,14,15,16,17];
const BlueHome = [55,49,50,51,52,53];
var RedHouse = false;
var BlueHouse = false;
var currentTurn = 0;
const safeStates = document.getElementById('safe');
const RedStart = RedHome[0];
const BlueStart = BlueHome[0];
var diceNumber = -1;

function randomNumber() {
    if(diceNumber == -1) {
        diceNumber = Math.floor(Math.random()*6)+1;
        let newImage = "./Images/" + diceNumber +".jpg"

        document.getElementById('diceImage').src = newImage;
        return;
    }

    if(diceNumber != 6 && PlayerStatus[currentTurn] == false) {
        diceNumber = -1;
        currentTurn = (currentTurn+1) % totalPlayers;

        document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
        document.getElementById('diceImage').src = "./Images/dice.gif";
        return;
    }
}

function MovePawn(id) {
    if(diceNumber == -1) return;
    if(id[0] == 'r' && currentTurn == 1) return;
    if(id[0] == 'b' && currentTurn == 0) return;

    var thisParent = document.getElementById(id).parentElement;
    var thisDiv = document.getElementById(id);

    let start = 0;
    let house = false;

    if(id[0] == 'r') {
        start = RedStart;
        house = RedHouse;
    }
    else {
        start = BlueStart;
        house = BlueHouse;
    }

    if(thisParent.classList.contains('block')) {
        if(diceNumber == 6) {
            PlayerStatus[currentTurn] = true;
            let copiedTo = document.getElementById('cell_'+start);
            copiedTo.append(thisDiv);

        }
    }
    else {
        //checks here!!!
        let position = parseInt(thisParent.id.split("_")[1]);
        position += diceNumber;
        position = othersHome(position);

        let hposition = myHome(position);
        if(hposition < position && house == true) {
            position = hposition;

            if(diceNumber != 6) {
                currentTurn = (currentTurn+1) % totalPlayers;
            }
        
            diceNumber = -1;
            document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
            document.getElementById('diceImage').src = "./Images/dice.gif";
            return;
        }


        let copiedTo = document.getElementById('cell_'+position);
        console.log(copiedTo.classList);

        if(copiedTo.childElementCount > 0) {
            let alsoSafe = asloSafe(copiedTo.id);
            if(alsoSafe == false && copiedTo.classList[4] != "safe") {
                for(let i = 0; i < copiedTo.childElementCount; i++) {
                    if(copiedTo.children[i].id[0] == 'b' && id[0] == 'r') {
                        let toDetele = copiedTo.children[i];
                        
                        document.getElementById(toDetele.id[0].toUpperCase()+id[id.length-1]).append(toDetele);
                    }
                    else if(copiedTo.children[i].id[0] == 'r' && id[0] == 'b') {
                        let toDetele = copiedTo.children[i];
    
                        document.getElementById(toDetele.id[0].toUpperCase()+id[id.length-1]).append(toDetele);
                    }
                }   
            }
        }

        copiedTo.append(thisDiv);
    }

    if(diceNumber != 6) {
        currentTurn = (currentTurn+1) % totalPlayers;
    }

    diceNumber = -1;
    document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
    document.getElementById('diceImage').src = "./Images/dice.gif";
}

function othersHome(position) {
    if(currentTurn == 0) {
        if(position >= 31 && position <= 35) {
            position+=5;
        }
        else if(position >= 49 && position <= 53) {
            position+=5;
        }
        else if(position >= 67 && position <= 71) {
            position+=5;
        }
    }
    else if(currentTurn == 1) {
        if(position >= 31 && position <= 35) {
            position+=5;
        }
        else if(position >= 13 && position <= 17) {
            position+=5;
        }
        else if(position >= 67 && position <= 71) {
            position+=5;
        }
    }

    if(position >= 73) {
        position = position-72;
    }

    return position;
}

function myHome(position) {
    if(currentTurn == 0) {
        if(position == RedHome[0]-1) {
            
            removePawns();
            alert('RED WINS');
        }
        else if(position >= RedHome[1] && position <= RedHome[5]) {
            RedHouse = true;
        }

        if(RedHouse == true) {
            if(position > RedHome[5]) {
                position = position - diceNumber;
            }
        }
        return position;
    }
    else if(currentTurn == 1) {
        if(position == BlueHome[0]-1) {
            
            removePawns();
            alert('BLUE WINS');
        }
        else if(position >= BlueHome[1] && position <= BlueHome[5]) {
            BlueHouse = true;
        }

        if(BlueHouse == true) {
            if(position > BlueHome[5]) {
                position = position - diceNumber;
            }
        }
        return position;
    }
}

function removePawns() {
    let allPawns = document.getElementsByClassName('pawn');

    let size = allPawns.length;
    for(let i = 0; i < size; i++) {
        let parent = allPawns[0].parentElement;

        
        parent.innerHTML = "";
    }
}

function asloSafe(cell_pos) {
    let gs = "cell_"+"1";
    let rs = "cell_"+"19";
    let ys = "cell_"+"37";
    let bs = "cell_"+"55";

    if(cell_pos == gs || cell_pos == rs || cell_pos == ys || cell_pos == bs) {
        return true;
    }
    return false;
}