const gameReport = document.querySelector('#report-file');
const evaluatePanel = document.querySelector('.evaluate-panel');
const moveHeader = document.querySelectorAll('h3 div');
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


let player1, player2;
let x = 23;
let y = 23; //coordinates
const tileWidth = 38;
const points = {
    A: 1,
    Ą: 5,
    B: 3,
    C: 2,
    Ć: 6,
    D: 2,
    E: 1,
    Ę: 5,
    F: 5,
    G: 3,
    H: 3,
    I: 1,
    J: 3,
    K: 2,
    L: 2,
    Ł: 3,
    M: 2,
    N: 1,
    Ń: 7,
    O: 1,
    Ó: 5,
    P: 2,
    R: 1,
    S: 1,
    Ś: 5,
    T: 2,
    U: 3,
    W: 1,
    Y: 2,
    Z: 1,
    Ź: 9,
    Ż: 5
};
const moves = [];
let moveNumber = 0,
    selectedOption,
    reverse = false;

const regActualPlayer = /->(\s*.*)/gi;
const regPossibilityMoves = /((best)|(\d+\.\d*))(.*)/gi;
const allRegex = /(->(\s*.*))| ((best)|(\d+\.\d*))(.*)/gi;

const setCanvas = () => {
    canvas.width = 593;
    canvas.height = 593;
    ctx.beginPath();
    ctx.fillStyle = "#F8E8C7";
    ctx.font = "28px sans-serif bold";
}
setCanvas();

const reset = () => {
    x = 23;
    y = 23;
};
const letterToNumber = a => {
    if (!a) return;
    if (a.toUpperCase() == "A") return 0;
    if (a.toUpperCase() == "B") return 1;
    if (a.toUpperCase() == "C") return 2;
    if (a.toUpperCase() == "D") return 3;
    if (a.toUpperCase() == "E") return 4;
    if (a.toUpperCase() == "F") return 5;
    if (a.toUpperCase() == "G") return 6;
    if (a.toUpperCase() == "H") return 7;
    if (a.toUpperCase() == "I") return 8;
    if (a.toUpperCase() == "J") return 9;
    if (a.toUpperCase() == "K") return 10;
    if (a.toUpperCase() == "L") return 11;
    if (a.toUpperCase() == "M") return 12;
    if (a.toUpperCase() == "N") return 13;
    if (a.toUpperCase() == "O") return 14;
};


const putStartCoordinates = (xy) => {
    let horizontal = true;
    if (xy[2]) {
        x = x + xy[1] * tileWidth;
        y = y + xy[0] * tileWidth;
    } else {
        x = x + xy[0] * tileWidth;
        y = y + xy[1] * tileWidth;
        horizontal = false;
    }
    return [x, y, horizontal];
};

const putCoordinates = function (coordinates) {
    const lastCoordinate = coordinates.slice(-1);
    // horizontal
    if (isNaN(lastCoordinate))
        return [coordinates.slice(0, -1) - 1, letterToNumber(lastCoordinate), 1];
    // vertical
    else return [letterToNumber(coordinates[0]), coordinates.slice(1) - 1, 0];
};

const findSelectedOption = index => moves[index].choiceOptions.find(option => (/\*/).test(option.coordinates));

const drawLetterOnBoard = (newMove, x, y, letter) => {
    newMove ? ctx.fillStyle = "#E8E847" : ctx.fillStyle = "#F8E8C7";
    ctx.fillRect(x + 1, y + 1, 36, 36);
    ctx.fillStyle = "#015B52";
    ctx.font = "10px sans-serif";
    let point = points[letter] || "";
    if (point == "") ctx.fillStyle = "rgba(1, 91, 82, 0.2)";
    ctx.fillText(point, x + 30, y + 35);
    ctx.font = "bold 28px sans-serif";
    if (letter.toUpperCase() == "W")
        ctx.fillText(letter.toUpperCase(), x + 6, y + 28);
    else if (letter.toUpperCase() == "I")
        ctx.fillText(letter.toUpperCase(), x + 16, y + 28);
    else ctx.fillText(letter.toUpperCase(), x + 10, y + 28);
};

const drawLettersOnBoard = (option, newMove) => {
    let word = option.word;
    if (!newMove)
        word = word.replace(/\(|\)/g, '');
    else {
        word = word.split('');
        while (word.indexOf('(') !== -1) {
            word.forEach((letter, index) => {
                if (word.indexOf('(') < index && word.indexOf(')') > index)
                    word[index] = '.';
            })
            word[word.indexOf('(')] = '';
            word[word.indexOf(')')] = '';
        }
        word = word.join('');
    }
    if (option.coordinates === 'xch' || option.coordinates === '*xch') return;
    const xy = putStartCoordinates(putCoordinates(option.coordinates.replace('*', '')));
    let x = xy[0];
    let y = xy[1];
    let horizontal = xy[2];
    [...word].forEach(letter => {
        if (letter == ".") {
            //. to litera leżąca na planszy, nie jest rysowana, idziemy dalej pionowo lub poziomo
            if (horizontal) x += tileWidth;
            else y += tileWidth;
            return;
        }
        drawLetterOnBoard(newMove, x, y, letter);
        if (horizontal)
            x += tileWidth;
        else
            y += tileWidth;
    })
    reset();
};
const createPossibilityDiv = (option) => {
    const newPosiibility = document.createElement("div");
    newPosiibility.classList.add('possibility');
    if (option.coordinates[0] === '*') {
        newPosiibility.classList.add('selected');
        reverse ? '' : drawLettersOnBoard(option, true);
    }
    evaluatePanel.appendChild(newPosiibility);
    Object.entries(option).forEach(
        ([key, value]) => {
            const div = document.createElement("div");
            div.textContent = value;
            div.classList.add(`${key}`);
            newPosiibility.appendChild(div);
        }
    );
}

const showPossibilities = () => {
    [...evaluatePanel.childNodes].filter(e => e.nodeName != "H3").forEach(e => e.remove());
    const i = moveNumber;
    moveHeader[0].textContent = moves[i].nick;
    moveHeader[1].textContent = moves[i].letters;
    moveHeader[2].textContent = moves[i].points_before;
    moves[i].choiceOptions.forEach(option => createPossibilityDiv(option));
}

const clearMove = (option) => {
    // if (moveNumber < 1) return;
    // moveNumber--;
    reset();

    let xy = putCoordinates(option.coordinates.replace('*', ''));
    if (xy[2]) {
        x = x + xy[1] * tileWidth;
        y = y + xy[0] * tileWidth;
    } else {
        x = x + xy[0] * tileWidth;
        y = y + xy[1] * tileWidth;
    }

    let word = option.word;
    (word.match(/\([\wąęćłńóśżź]*\)/gi) || []).forEach(e => word = word.replace(e, '.'.repeat(e.length - 2)));

    [...word].forEach(letter => {
        if (letter == ".") {
            if (xy[2]) x += tileWidth;
            else y += tileWidth;
            return;
        }
        ctx.clearRect(x, y, tileWidth, tileWidth);
        if (xy[2]) x += tileWidth;
        else y += tileWidth;
    })
};


const readReport = e => {
    const game = e.target.files[0];
    if (!game) return 0;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.match(allRegex);
        lines.forEach((line, i) => {
            const atoms = lines[i].replace(/\*/g, ' *').split(/\s+/).filter(el => el !== '');
            if (lines[i].match(regActualPlayer)) {
                moves.push({
                    index: moves.length,
                    nick: atoms[1],
                    letters: atoms[2],
                    points_before: atoms[3],
                    move: lines[i],
                    choiceOptions: []
                });
            }
            else {
                moves[moves.length - 1].choiceOptions.push({
                    evaluate: atoms[0],
                    coordinates: atoms[1],
                    word: atoms[2],
                    move_points: atoms[3],
                    percent: atoms.length > 4 ? (atoms[4][atoms[4].length - 1] === '%' ? atoms[4] : '0%') : ''
                    // free_letters: atoms[4][atoms[4].length - 1] === '%' ? atoms[4] : '0%'
                });
            }
        })
        showPossibilities();
    };
    reader.readAsText(game);
};

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 39) {
        reverse = false;
        drawLettersOnBoard(findSelectedOption(moveNumber), false);
        moveNumber++;
    }
    else if (e.keyCode === 37) {
        reverse = true;
        clearMove(findSelectedOption(moveNumber));
        moveNumber > 0 ? moveNumber-- : moveNumber = 0;
    }
    else return;
    showPossibilities();
})
gameReport.addEventListener("input", readReport);
