var canvas = document.querySelector('canvas');
var button = document.getElementById('next');
var remove = document.getElementById('reset');
var previous = document.getElementById('previous');
var rack = document.getElementById("rack");
var file = document.getElementById('file-input');
var nick = document.getElementById("nick");
var ctx = canvas.getContext("2d");
var classes = document.getElementsByClassName("move");
var ok = document.getElementById("ok");
var player1, player2;
var resultPlayer1 = document.getElementById("result1");
var resultPlayer2 = document.getElementById("result2");
canvas.width = 593;
canvas.height = 593;
ctx.beginPath();
ctx.fillStyle = "#F8E8C7";
ctx.font = "28px sans-serif bold";
var x = 23;
var y = 23;  //coordinates 
var move = 0;
var words = [];
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


let letterToNumber = function (a) {
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


let reset = function () {
    x = 23;
    y = 23;
}


let setRack = function () {
    setNick(words[move].split(" ")[0]);
    let letters = words[move].split(" ")[1];
    let node, textnode, content, sub, textsub;
    for (let i = 0; i < letters.length; i++) {
        node = document.createElement("li");
        sub = document.createElement("sub");
        textnode = document.createTextNode(letters[i]);
        textsub = document.createTextNode(points[letters[i]] || "");
        sub.appendChild(textsub);
        node.appendChild(textnode);
        node.appendChild(sub);
        rack.appendChild(node);
    }
}


let setNick = function (n) {
    nick.innerHTML = n.slice(1, -1);
}


let clearRack = function () {
    nodes = document.getElementsByTagName("li");
    let l = nodes.length;
    for (let i = 0; i < l; i++) {
        rack.removeChild(nodes.item(0));
    }

}


let coordinates = function (c) {
    let a = c.slice(-1);
    if (isNaN(a)) { // horizontal
        let n = letterToNumber(a);
        return [c.slice(0, -1) - 1, n, 1];
    } else { // vertical
        let n = letterToNumber(c[0]);
        return [n, c.slice(1, ) - 1, 0];
    }

}


let put = function (index) {
    reset();
    let word = words[index].split(" ");
    //word[0] - nick, [1] - litery, [2] - współrzędne, [3] - główny wyraz, [4] - punkty za ruch, [5] - suma punktów
    if (word[2] == "--") {
        // -- oznacza stratę w poprzednim ruchu
        clearMove();
        move++;
        clearRack();
        return;
    } else if (word[2].startsWith("-")) //wymiana w poprzednim ruchu
        alert("wymiana " + word[2].slice(1));
    let xy = coordinates(word[2]);
    if (xy[2]) {
        x = x + xy[1] * 38;
        y = y + xy[0] * 38;
    } else {
        x = x + xy[0] * 38;
        y = y + xy[1] * 38;
    }

    //wyświetlanie kolejnych liter w wyrazie w danym ruchu
    for (let i = 0; i < word[3].length; i++) {
        let letter = word[3][i];
        if (letter == ".") {

            //. to litera leżąca na planszy, nie jest rysowana, idziemy dalej pionowo lub poziomo
            if (xy[2]) x += 38;
            else y += 38;
            continue;
        }
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
        if (xy[2]) x += 38;
        else y += 38;

    }
    if (word[4].startsWith("+") || word[4].startsWith("-")) {
        if (word[0].slice(1,-1) == player1) {
            let p = resultPlayer1.innerHTML;
            p = parseInt(p) + parseInt( word[4]);
            resultPlayer1.innerHTML = p;

        } else {
             let p = resultPlayer2.innerHTML;
            p = parseInt(p) + parseInt( word[4]);
            resultPlayer2.innerHTML = p;

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
    move = 0;
    clearRack();
}


function next() {
    clearRack();
    put(move);
    move++;
    setRack();
}


function clearMove() {
    move--;
    clearRack();
    reset();
    let word = words[move].split(" ");
    
    if (word[4].startsWith("+") || word[4].startsWith("-")) {
        if (word[0].slice(1,-1) == player1) {
            let p = resultPlayer1.innerHTML;
            p = parseInt(p) - parseInt( word[4]);
            resultPlayer1.innerHTML = p;

        } else {
             let p = resultPlayer2.innerHTML;
            p = parseInt(p) - parseInt( word[4]);
            resultPlayer2.innerHTML = p;

        }
    }

    
    let xy = coordinates(word[2]);
    if (xy[2]) {
        x = x + xy[1] * 38;
        y = y + xy[0] * 38;
    } else {
        x = x + xy[0] * 38;
        y = y + xy[1] * 38;
    }
    for (let i = 0; i < word[3].length; i++) {
        let letter = word[3][i];
        if (letter == ".") {
            if (xy[2]) x += 38;
            else y += 38;
            continue;
        }
        ctx.clearRect(x, y, 38, 38);
        if (xy[2]) x += 38;
        else y += 38;
    }
    setRack();
}



function readGame(e) {
    words = [];
    clearAll();
    var game = e.target.files[0];
    if (!game) return 0;
    var reader = new FileReader();
    reader.onload = function (e) {
        var content = e.target.result;
        var lines = content.split('\n');
        let players = document.getElementById("players");
        player1 = lines[0].split(" ")[1];
        player2 = lines[1].split(" ")[1];
        players.innerHTML = player1;
        players.innerHTML += " : " + player2;
        for (let i = 2; i < lines.length; i++) {
            words.push(lines[i]);
        }
        setRack();
    }
    reader.readAsText(game);
    file.style.display = "none";

}

//funkcja do pobierania wprowadzonej przez użytkownika partii
function downloadGame() {
    let document = "";
    for (let i = 0; i < words.length; i++) {
        document += words[i] + "\n";
    }
    let blob = new Blob([document], {
        type: 'text/gcg'
    });
    let a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    let name = nick1[0].value + " vs " + nick2[0].value + ".gcg";
    a.download = name;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    
}

var nick1 = document.getElementsByName("player1");
var nick2 = document.getElementsByName("player2");


//funkcja do oglądania wprowadzonej ręcznie partii
function createFile() {
    words = [];
    clearAll();
    let row = "",
        inputs, letters, word, nick, coordinates;

    words[0] = "#player1 " + nick1[0].value + " " + nick1[0].value;
    words[1] = "#player2 " + nick2[0].value + " " + nick2[0].value;
    for (let i = 0; i < classes.length; i++) {
        row = "";
        if (!(i % 2)) nick = nick1[0].value;
        else nick = nick2[0].value;
        row += ">" + nick + ": ";
        inputs = classes[i].getElementsByTagName("input");
        coordinates = inputs[1].value.toUpperCase();
        if (coordinates.length > 0) coordinates += " "; //spacja jeżeli są współrzędne, a więc nie było wymiany - przeciwdziała podwójnej spacji w przypadku braku współrzędnych
        if (inputs[2].value.startsWith("s(")) word = inputs[2].value.slice(2, -1);
        else word = inputs[2].value;
        if (inputs[2].value.startsWith("w(")) {
            word = "-" + inputs[2].value.slice(2, -1);
        }
        if (inputs[0].value.indexOf("-") == -1) {
            letters = inputs[0].value.replace(/\s/g, '').toUpperCase();
        } else
            letters = word.replace(/\./g, "").replace(/\s/g, '').toUpperCase();
        word = findBlanks(word.toUpperCase());
        row += letters + " " + coordinates + word + " +" + inputs[3].value;
        words.push(row);
        if (inputs[2].value.startsWith("s(")) {
            row = "";
            row += ">" + nick + ": " + letters + " -- " + "0";
            words.push(row);
        }
    }
    view2.style.display = "inline";
    file.style.display = "none";
    move = 2;
    setRack();
    document.getElementById("download").style.display = "block";
}

ok.addEventListener("click", createFile);
button.addEventListener("click", next);
remove.addEventListener("click", clearAll);
previous.addEventListener("click", clearMove);
file.addEventListener("input", readGame);
document.getElementById("download").addEventListener("click", downloadGame);
