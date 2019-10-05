const gameReport = document.querySelector('#report-file');
const evaluatePanel = document.querySelector('.evaluate-panel');
const moveHeader = document.querySelectorAll('h3 div');
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


let player1, player2;

let x = 23;
let y = 23; //coordinates
const tileWidth = 38;


const moves = [];
let moveNumber = 0;
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

const createPossibilityDiv = (option) => {
    const newPosiibility = document.createElement("div");
    newPosiibility.classList.add('possibility');
    console.log(option.coordinates[0]);
    option.coordinates[0] === '*' ? newPosiibility.classList.add('selected') : '';
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

const readReport = e => {
    const game = e.target.files[0];
    if (!game) return 0;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.match(allRegex);
        lines.forEach((line, i) => {
            const atoms = lines[i].replace(/\*/g, ' *').split(/\s+/).filter(el => el !== '');
            console.log(atoms);
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
    };
    reader.readAsText(game);
};

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 39) moveNumber++;
    else if (e.keyCode === 37) moveNumber > 0 ? moveNumber-- : moveNumber = 0;
    else return;
    showPossibilities();
})
gameReport.addEventListener("input", readReport);
