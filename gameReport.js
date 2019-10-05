const gameReport = document.querySelector('#report-file');

const moves = [];

const regActualPlayer = /->(\s*.*)/gi;
const regPossibilityMoves = /((best)|(\d+\.\d*))(.*)/gi;
const allRegex = /(->(\s*.*))| ((best)|(\d+\.\d*))(.*)/gi;

const readReport = e => {
    const game = e.target.files[0];
    if (!game) return 0;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.match(allRegex);

        lines.forEach((line, i) => {
            if (lines[i].match(regActualPlayer)) {
                moves.push({
                    index: moves.length,
                    move: lines[i],
                    choiceOptions: []
                });
            }
            else
                moves[moves.length - 1].choiceOptions.push(lines[i]);
        })
        // for (let i = 0; i < lines.length; i++) {
        //     if (lines[i].match(regActualPlayer)) {
        //         moves.push({
        //             index: moves.length,
        //             move: lines[i],
        //             choiceOptions: []
        //         });
        //     }
        //     else
        //         moves[moves.length - 1].choiceOptions.push(lines[i]);
        // }
        console.log(moves);
    };
    reader.readAsText(game);
};
gameReport.addEventListener("input", readReport);
