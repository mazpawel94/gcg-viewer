const previousButton = document.getElementById('previous');
const rack = document.querySelectorAll(".rack")[0];
const ul = rack.querySelector("ul");
const previousRack = document.querySelectorAll(".rack")[1];
const ul2 = previousRack.querySelector("ul");
const file = document.getElementById('file');
const nick = document.querySelector(".nick");
const resultPlayer1 = document.getElementById("result1");
const resultPlayer2 = document.getElementById("result2");
const deletionLetter = document.body.querySelectorAll('.deletion-letter');
const deletion = document.body.querySelector('.deletion');
const comment = document.querySelector('.comment');


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
canvas.width = 593;
canvas.height = 593;
ctx.beginPath();
ctx.fillStyle = "#F8E8C7";
ctx.font = "28px sans-serif bold";

let player1, player2;

let x = 23;
let y = 23;  //coordinates 
let moveNumber = 0;
let moves = [];
const tileWidth = 38;

const points = {
    'A': 1,
    'Ą': 5,
    'B': 3,
    'C': 2,
    'Ć': 6,
    'D': 2,
    'E': 1,
    'Ę': 5,
    'F': 5,
    'G': 3,
    'H': 3,
    'I': 1,
    'J': 3,
    'K': 2,
    'L': 2,
    'Ł': 3,
    'M': 2,
    'N': 1,
    'Ń': 7,
    'O': 1,
    'Ó': 5,
    'P': 2,
    'R': 1,
    'S': 1,
    'Ś': 5,
    'T': 2,
    'U': 3,
    'W': 1,
    'Y': 2,
    'Z': 1,
    'Ź': 9,
    'Ż': 5
};


const letterToNumber = function (a) {
    if (!a)
        return;
    if (a.toUpperCase() == "A")
        return 0;
    if (a.toUpperCase() == "B")
        return 1;
    if (a.toUpperCase() == "C")
        return 2;
    if (a.toUpperCase() == "D")
        return 3;
    if (a.toUpperCase() == "E")
        return 4;
    if (a.toUpperCase() == "F")
        return 5;
    if (a.toUpperCase() == "G")
        return 6;
    if (a.toUpperCase() == "H")
        return 7;
    if (a.toUpperCase() == "I")
        return 8;
    if (a.toUpperCase() == "J")
        return 9;
    if (a.toUpperCase() == "K")
        return 10;
    if (a.toUpperCase() == "L")
        return 11;
    if (a.toUpperCase() == "M")
        return 12;
    if (a.toUpperCase() == "N")
        return 13;
    if (a.toUpperCase() == "O")
        return 14;
}


const reset = function () {

    x = 23;
    y = 23;
}


const createTileOnRack = function (letter) {

    const node = document.createElement("li");
    const sub = document.createElement("sub");
    const textnode = document.createTextNode(letter);
    const textsub = document.createTextNode(points[letter] || "");
    sub.appendChild(textsub);
    node.appendChild(textnode);
    node.appendChild(sub);
    ul.appendChild(node);
}

const setRack = function () {

    const move = decodeMove(moveNumber);
    setNick(move[0]);
    const letters = move[1];
    [...letters].forEach(letter => {
        createTileOnRack(letter);
        deleteLetterInDeletion(letter);
    });
    [...document.querySelectorAll('.actual li')].forEach((div, index) => {
        div.style.order = index;
        div.addEventListener('mousedown', activateLetter);
        div.addEventListener('touchstart', touchActivateLetter);
        div.addEventListener('mouseup', dropLetter);
        div.addEventListener('touchend', dropLetter);
   });
}

const setNick = function (n) {

    nick.innerHTML = n.slice(1, -1).replace(/_/g, ' ');
}

const setOldRack = function (nodes) {

    const oldNodes = document.querySelectorAll(".previous li");
    [...oldNodes].forEach(node => ul2.removeChild(node));
    const word = decodeMove(moveNumber)[3].replace(/[a-ząężćźżłńóś]/g, '?').split('');
    [...nodes].forEach( node =>  {
        if(word.indexOf(node.textContent[0])!==-1) {
            node.style.backgroundColor="gray";
            delete word[word.indexOf(node.textContent[0])];
        }
        addLetterInDeletion(node.textContent[0]);
        node.classList.add('old');
        ul2.appendChild(node);
    });
    previousRack.querySelector('p').textContent = nick.innerHTML;
}

const clearRack = function () {

    const nodes = document.querySelectorAll(".actual li");
    [...nodes].forEach( node => ul.removeChild(node));
    setOldRack(nodes);
    previousRack.querySelector('p').textContent = nick.innerHTML;
}


const deleteLetterInDeletion = (letter) => {

    if(letter === '+' || letter === '0')  return;
    letter = letter.replace(/[a-ząężćźżłńóś?]/, '')
    const change = [...deletionLetter].filter(e => !e.classList.contains('deleted'))
                                      .find(e => e.textContent === letter);
    change.classList.add('deleted');
}


const addLetterInDeletion = (letter) => {   //cofa skreślenie - przy cofaniu ruchu

    if(letter === '+' || letter === '0' || letter ==='.')  return;
    letter = letter.replace(/[a-ząężćźżłńóś?]/, '')
    const change = [...deletionLetter].filter(e => e.classList.contains('deleted')).find(e => e.textContent === letter);
    change.classList.remove('deleted');
}



const putCoordinates = function (coordinates) {

    const lastCoordinate = coordinates.slice(-1);
    if (isNaN(lastCoordinate)) // horizontal
        return [coordinates.slice(0, -1) - 1, letterToNumber(lastCoordinate), 1];
    else  // vertical
        return [letterToNumber(coordinates[0]), coordinates.slice(1, ) - 1, 0];
}

const decodeMove = (index) => {
    //word[0] - nick, [1] - litery, [2] - współrzędne, [3] - główny wyraz, [4] - punkty za ruch, [5] - suma punktów
    return moves[index].split(" ");
}

const turnOver = function() {

    clearMove();
    moveNumber++;
    clearRack();
}

const putStartCoordinates = function (xy) {

    let horizontal = true;
    if (xy[2]) {
        x = x + xy[1] * tileWidth;
        y = y + xy[0] * tileWidth;
    } else {
        x = x + xy[0] * tileWidth;
        y = y + xy[1] * tileWidth;
        horizontal = false;
    }
    return [x,y, horizontal];
}

const drawLetterOnBoard = function(newMove, x, y, letter) {

    if(newMove) 
        ctx.fillStyle = "#E8E847";
    else
        ctx.fillStyle = "#F8E8C7";
    ctx.fillRect(x + 1, y + 1, 36, 36);
    ctx.fillStyle = "#015B52";
    ctx.font = "10px sans-serif";
    let point = points[letter] || "";
    if (point == "") ctx.fillStyle = "rgba(1, 91, 82, 0.2)";
    ctx.fillText(point, x + 30, y + 35);
    ctx.font = "bold 28px sans-serif";
    if (letter.toUpperCase() == "W") ctx.fillText(letter.toUpperCase(), x + 6, y + 28);
    else if (letter.toUpperCase() == "I") ctx.fillText(letter.toUpperCase(), x + 16, y + 28);
    else ctx.fillText(letter.toUpperCase(), x + 10, y + 28);

}

const drawLettersOnBoard = (moveTab, newMove) => {

    const word = moveTab[3];
    const xy = putStartCoordinates(putCoordinates(moveTab[2]));
    let x = xy[0];
    let y = xy[1];
    let horizontal = xy[2];
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letter == ".") {  //. to litera leżąca na planszy, nie jest rysowana, idziemy dalej pionowo lub poziomo
            if (horizontal) x += tileWidth;
            else y += tileWidth;
            continue;
        }
        drawLetterOnBoard(newMove, x, y, letter);
        if(newMove) deleteLetterInDeletion(letter);
        if (horizontal) x += tileWidth;
        else y += tileWidth;
    }
    reset();
}
const showComment = (text) => {
    comment.querySelector('span').textContent = text;
    comment.style.display = 'block';
}

const move = function (index) {

    let word = decodeMove(index);
    reset();
    if(index>0) 
        drawLettersOnBoard(decodeMove(index-1), false);
    
    if (word[2] == "--") { // -- oznacza stratę w poprzednim ruchu        
       turnOver();
        return;
    }
    if (word[2].startsWith("-")) //wymiana w poprzednim ruchu
        showComment(`wymiana ${word[2].slice(1)}`);
    if(word[0].includes('#note')) {
        showComment(`${word.join(' ')}`);
        return;
    }        
        // alert("wymiana " + word[2].slice(1));
    //wyświetlanie kolejnych liter w wyrazie w danym ruchu
    drawLettersOnBoard(word, true);
   
    if (word[4].startsWith("+") || word[4].startsWith("-")) {
        if (word[0].slice(1,-1).replace(/_/g, ' ') == player1) {
            let p = resultPlayer1.innerHTML;
            p = parseInt(p) + parseInt( word[4]);
            resultPlayer1.innerHTML = `${p}(${word[4]})`;
            resultPlayer2.innerHTML = resultPlayer2.innerHTML.split('(')[0];

        } else {
             let p = resultPlayer2.innerHTML;
            p = parseInt(p) + parseInt( word[4]);
            resultPlayer2.innerHTML =`${p}(${word[4]})`;
            resultPlayer1.innerHTML = resultPlayer1.innerHTML.split('(')[0];

        }
    }

}


function findBlanks(word) {
    let i = word.indexOf("("), w;
    if(i>-1) {
        w = word.slice(0,i) + word[i+1].toLowerCase() +  word.slice(i+2,);
    }
    i = String(w).indexOf("(");
    if(i>-1) {
        w = w.slice(0,i) + w[i+1].toLowerCase() +  w.slice(i+2,);
    }
    return String(w).replace(")", "").replace(")", "");
}

function clearAll() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(moveNumber) clearRack();
    moveNumber = 0;
    resultPlayer1.innerHTML = 0;
    resultPlayer2.innerHTML = 0;
    
}

function next() {

    clearRack();
    move(moveNumber);
    if(moveNumber<moves.length)  moveNumber++;
    setRack();
}


function clearMove() {

    if(moveNumber>=1)  moveNumber--;
    clearRack();
    const oldNodes = document.querySelectorAll(".previous li");
    [...oldNodes].forEach(node => ul2.removeChild(node));
    reset();
    const word = decodeMove(moveNumber);
    [...word[3]].forEach(letter => addLetterInDeletion(letter));
    if (word[4].startsWith("+") || word[4].startsWith("-")) {
        if (word[0].slice(1,-1).replace(/_/g, ' ') == player1) {
            let p = resultPlayer1.innerHTML;
            p = parseInt(p) - parseInt( word[4]);
            resultPlayer1.innerHTML = p;

        } else {
             let p = resultPlayer2.innerHTML;
            p = parseInt(p) - parseInt( word[4]);
            resultPlayer2.innerHTML = p;

        }
    }

    
    let xy = putCoordinates(word[2]);
    if (xy[2]) {
        x = x + xy[1] * tileWidth;
        y = y + xy[0] * tileWidth;
    } else {
        x = x + xy[0] * tileWidth;
        y = y + xy[1] * tileWidth;
    }
    for (let i = 0; i < word[3].length; i++) {
        let letter = word[3][i];
        if (letter == ".") {
            if (xy[2]) x += tileWidth;
            else y += tileWidth;
            continue;
        }
        ctx.clearRect(x, y, tileWidth, tileWidth);
        if (xy[2]) x += tileWidth;
        else y += tileWidth;
    }
    setRack();
}



function readGame(e) {
    moves = [];
    clearAll();
    const game = e.target.files[0];
    if (!game) return 0;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.split('\n');
        const players = document.querySelectorAll(".players");
        player1 = lines[0].split(" ")[1].replace(/_/g, ' ');
        player2 = lines[1].split(" ")[1].replace(/_/g, ' ');
        players[0].innerHTML = player1;
        players[1].innerHTML = player2;
        for (let i = 2; i < lines.length; i++) {
            moves.push(lines[i]);
        }
        setRack();
    }
    reader.readAsText(game);
    file.style.display = "none";
    document.body.querySelector('label').style.display = 'none';

}

//funkcja do pobierania wprowadzonej przez użytkownika partii
// function downloadGame() {
//     let document = "";
//     for (let i = 0; i < moves.length; i++) {
//         document += moves[i] + "\n";
//     }
//     let blob = new Blob([document], {
//         type: 'text/gcg'
//     });
//     let a = window.document.createElement("a");
//     a.href = window.URL.createObjectURL(blob);
//     let name = nick1[0].value + " vs " + nick2[0].value + ".gcg";
//     a.download = name;
//     window.document.body.appendChild(a);
//     a.click();
//     window.document.body.removeChild(a);
    
// }

// const nick1 = document.getElementsByName("player1");
// const nick2 = document.getElementsByName("player2");


// //funkcja do oglądania wprowadzonej ręcznie partii
// function createFile() {
//     moves = [];
//     clearAll();
//     let row = "",
//         inputs, letters, word, nick, coordinates;

//     moves[0] = "#player1 " + nick1[0].value + " " + nick1[0].value;
//     moves[1] = "#player2 " + nick2[0].value + " " + nick2[0].value;
//     for (let i = 0; i < classes.length; i++) {
//         row = "";
//         if (!(i % 2)) nick = nick1[0].value;
//         else nick = nick2[0].value;
//         row += ">" + nick + ": ";
//         inputs = classes[i].getElementsByTagName("input");
//         coordinates = inputs[1].value.toUpperCase();
//         if (coordinates.length > 0) coordinates += " "; //spacja jeżeli są współrzędne, a więc nie było wymiany - przeciwdziała podwójnej spacji w przypadku braku współrzędnych
//         if (inputs[2].value.startsWith("s(")) word = inputs[2].value.slice(2, -1);
//         else word = inputs[2].value;
//         if (inputs[2].value.startsWith("w(")) {
//             word = "-" + inputs[2].value.slice(2, -1);
//         }
//         if (inputs[0].value.indexOf("-") == -1) {
//             letters = inputs[0].value.replace(/\s/g, '').toUpperCase();
//         } else
//             letters = word.replace(/\./g, "").replace(/\s/g, '').toUpperCase();
//         word = findBlanks(word.toUpperCase());
//         row += letters + " " + coordinates + word + " +" + inputs[3].value;
//         moves.push(row);
//         if (inputs[2].value.startsWith("s(")) {
//             row = "";
//             row += ">" + nick + ": " + letters + " -- " + "0";
//             moves.push(row);
//         }
//     }
//     view2.style.display = "inline";
//     file.style.display = "none";
//     moveNumber = 2;
//     setRack();
//     document.getElementById("download").style.display = "block";
// }

// ok.addEventListener("click", createFile);
document.getElementById('next').addEventListener("click", next);
document.getElementById('reset').addEventListener("click", clearAll);
previousButton.addEventListener("click", clearMove);
file.addEventListener("input", readGame);
// document.getElementById("download").addEventListener("click", downloadGame);

// document.body.querySelector('#complete-game').addEventListener("click", function () {
//     let content = document.getElementById("view2");
//     if (content.style.display == "flex") content.style.display = "none";
//     else content.style.display = "flex";
//     // document.getElementById("view1").style.display = "none";
//     this.style.display = "none";
//     // opt2.style.display = "none";
// })
document.body.querySelector('.deletion-show').addEventListener('click', () => deletion.classList.add('active'));
document.querySelector('.close').addEventListener('click', () => deletion.classList.remove('active'));
comment.querySelector('button').addEventListener('click', ()=> comment.style.display='none');