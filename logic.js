//store count of total players playing this game
const totalPlayers = 2;
//store name/color of the players
const PlayerColors = ["Red","Blue"];
//if any 1 of the pawn is outside the block(alive), the status of that
//particular index will be true. actually it is storing that if player is eligible to make a move.
var PlayerAliveStatus = [false, false];
//stroing all safe home for red player
const RedHome = [19,13,14,15,16,17];
//storing all safe home for blue plaer
const BlueHome = [55,49,50,51,52,53];
//4 pawns -> 4 status, 1 for each pawn -> check if that pawn is inside or outside block
var RedHouse = [false, false, false, false];
var RedInHome = [false, false, false, false];
var BlueHouse = [false, false, false, false];
var BlueInHome = [false, false, false, false];
//current turn indicator -> 0 means red turn, 1 means blue turn
var currentTurn = 0;

//const safeStates = document.getElementById('safe');

// const RedStart = RedHome[0];
// const BlueStart = BlueHome[0];
//store random dice number
var diceNumber = -1;
var pawnsFinished = [0,0];

const RedStart = 6;
const BlueStart = 41;



//check if player is stuck 
function isStuck() {
    if(currentTurn == 0) {
        for(let i = 1; i <= 4; i++) {
            let pawnP = document.getElementById("red_"+i);

            if(pawnP != null) {
                let cell = pawnP.parentElement;

                let cellNum = parseInt(cell.id.split("_")[1]);
                console.log(cellNum);
                if(diceNumber + cellNum <= RedHome[0]-1) {
                    return false;
                }
            }
        }
        return true;
    }
    else if(currentTurn == 1) {
        for(let i = 1; i <= 4; i++) {
            let pawnP = document.getElementById("blue_"+i);

            if(pawnP != null) {
                let cell = pawnP.parentElement;

                let cellNum = parseInt(cell.id.split("_")[1]);
                console.log(cellNum);
                if(diceNumber + cellNum <= BlueHome[0]-1) {
                    return false;
                }
            }
        }
        return true;
    }
}
//function that will generate a random number between 1-6(inclusive)
function randomNumber() {
    //if dice number == -1, means that previous player has already made its move
    if(isStuck() && PlayerAliveStatus[currentTurn] == true) {
        diceNumber = -1;
        currentTurn = (currentTurn+1) % totalPlayers;

        document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
        document.getElementById('player_turn_text').style.color = PlayerColors[currentTurn].toLowerCase();
        document.getElementById('diceImage').src = "./Images/dice.gif";
        return;
    }
    if(diceNumber == -1) {
        diceNumber = Math.floor(Math.random()*6)+1;
        let newImage = "./Images/" + diceNumber +".jpg"
        //change the image according to the new random number
        document.getElementById('diceImage').src = newImage;
        return;
    }

    if(diceNumber != 6 && PlayerAliveStatus[currentTurn] == false) {
        diceNumber = -1;
        currentTurn = (currentTurn+1) % totalPlayers;

        document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
        document.getElementById('player_turn_text').style.color = PlayerColors[currentTurn].toLowerCase();
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
        house = PlayerAliveStatus[0];
    }
    else {
        start = BlueStart;
        house = PlayerAliveStatus[1];
    }

    //if pawn is not alive or moving free
    if(thisParent.classList.contains('block')) {
        //check if dice number is 6 so that he can be freed.
        if(diceNumber == 6) {
            PlayerAliveStatus[currentTurn] = true;
            
            if(id[0]== 'r') {
                RedHouse[parseInt(id[id.length-1])-1] = true;
            }
            else {
                BlueHouse[parseInt(id[id.length-1])-1] = true;
            }

            let appendTo = document.getElementById('cell_'+start);
            appendTo.append(thisDiv);
        }
        //if not 6, then check if any of the other pawn of player is free or not.
        else if(house == true) {
            //if free, then allow user to choose the other pawn.
            return;
        }
        //if not, then this player turn will be throw as a waste.
    }
    else {
        //get current position
        let position = parseInt(thisParent.id.split("_")[1]);
        //add dice number to get new position to jump.
        position += diceNumber;
        //check if its other color home or not.
        position = othersHome(position);

        //check if its my home or not
        
        let hposition = myHome(position, parseInt(id[id.length-1])-1);
        //if new position is less than my position, then stay at my position
        if(hposition < position) { 
            if(otherAlive(id[0]) == false) {
                position = hposition;

                if(diceNumber != 6) {
                    currentTurn = (currentTurn+1) % totalPlayers;
                }
            
                diceNumber = -1;
                document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
                document.getElementById('player_turn_text').style.color = PlayerColors[currentTurn].toLowerCase();
                document.getElementById('diceImage').src = "./Images/dice.gif";
                return;
            }
            if(otherAlive(id[0]) == true) {
                console.log(position);
                return;
            }
        }
        let appendTo = document.getElementById('cell_'+position);
        console.log(appendTo.classList);

        if(appendTo.childElementCount > 0) {
            let alsoSafe = asloSafe(appendTo.id);
            if(alsoSafe == false && appendTo.classList[4] != "safe") {
                for(let i = 0; i < appendTo.childElementCount; i++) {
                    if(appendTo.children[i].id[0] == 'b' && id[0] == 'r') {
                        let toDetele = appendTo.children[i];
                        
                        document.getElementById(toDetele.id[0].toUpperCase()+id[id.length-1]).append(toDetele);
                        BlueHouse[parseInt(toDetele.id[toDetele.id.length-1])-1] = false;
                        changeAliveStatus(1);
                    }
                    else if(appendTo.children[i].id[0] == 'r' && id[0] == 'b') {
                        let toDetele = appendTo.children[i];
    
                        document.getElementById(toDetele.id[0].toUpperCase()+id[id.length-1]).append(toDetele);
                        RedHouse[parseInt(toDetele.id[toDetele.id.length-1])-1] = false;
                        changeAliveStatus(0);
                    }
                }   
            }
        }

        appendTo.append(thisDiv);
    }

    if(diceNumber != 6) {
        currentTurn = (currentTurn+1) % totalPlayers;
    }

    diceNumber = -1;
    document.getElementById('player_turn_text').innerHTML = PlayerColors[currentTurn];
    document.getElementById('player_turn_text').style.color = PlayerColors[currentTurn].toLowerCase();
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

function myHome(position, id_num) {
    if(currentTurn == 0) {
        if(position == RedHome[0]-1) {
            pawnsFinished[0]++;
            let num = parseInt(id_num)+1;

            let parent = document.getElementById("red_"+num).parentElement;
            let thisPawn = document.getElementById("red_"+num);
            RedHouse[id_num] =false;
            changeAliveStatus(0);

            parent.removeChild(thisPawn);

            WIN("r");
        }
        else if(position >= RedHome[1] && position <= RedHome[5]) {
            RedInHome[id_num] = true;
        }

        if(RedInHome[id_num] == true) {
            if(position > RedHome[5]) {
                position = position - diceNumber;
            }
        }
        return position;
    }
    else if(currentTurn == 1) {
        if(position == BlueHome[0]-1) {
            pawnsFinished[1]++;

            let num = parseInt(id_num)+1;
            var parent = document.getElementById('blue_'+num).parentElement;
            parent.removeChild(document.getElementById('blue_'+num));
            BlueHouse[id_num] = false;
            changeAliveStatus(1);

            WIN("b");
        }
        else if(position >= BlueHome[1] && position <= BlueHome[5]) {
            BlueInHome[id_num] = true;
        }

        if(BlueInHome[id_num] == true) {
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

//id == 0 -> RED, 1 -> BLUE
function changeAliveStatus(id) {
    if(id == 0) {
        for(let i = 0; i < 4; i++) {
            if(RedHouse[i] == true) {
                PlayerAliveStatus[id] = true;
                return;
            }
        }
    }
    else if(id == 1) {
        for(let i = 0; i < 4; i++) {
            if(BlueHouse[i] == true) {
                PlayerAliveStatus[id] = true;
                return;
            }
        }
    }
    PlayerAliveStatus[id] = false;
}

function otherAlive(color) {
    let count = 0;
    if(color == "r") {
        for(let i = 0; i < 4; i++) {
            if(RedHouse[i] == true) count++;
        }
    }
    else if(color == "b") {
        for(let i = 0; i < 4; i++) {
            if(BlueHouse[i] == true) count++;
        }
    }

    return count >= 2;
}

function WIN(color) {
    if(color == "r" && pawnsFinished[0] == 4) {
        removePawns();
        alert('RED WINS');
    }
    else if(color == "b" && pawnsFinished[1] == 4) {
        removePawns();
        alert('BLUE WINS');
    }
}