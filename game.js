const gridRef = document.getElementById("grid-container");
const gameMessageRef = document.getElementById("game-message");
const grid = []
let allTiles;
let emptyCoord = { row: 3, column: 3 };

function init() {
    for (let i = 0; i < 4; i++) {
        const row = []
        for (let j = 0; j < 4; j++) {
            if (i == 3 && j == 3) {
                row.push(0);
            } else {
                const tileRef = document.createElement("div");
                const tileInfo = { tileRef, position: { row: i, column: j }, originalPostion: { row: i, column: j } }
                tileRef.classList = 'tile';
                tileRef.style['top'] = (i * 160) + 'px';
                tileRef.style['left'] = (j * 160) + 'px';
                tileRef.style['background-position'] = `-${j * 160}px -${i * 160}px`
                tileRef.onclick = () => onTileClicked(tileInfo);
                gridRef.appendChild(tileRef);
                row.push(tileInfo);
            }
        }
        grid.push(row);
    }
    allTiles = grid.flat().filter(tile => tile !== 0);
}

function shuffle() {
    allTiles.forEach(tile => tile.tileRef.classList = 'tile speed');
    for (let i = 0; i < 400; i++) {
        const randomIndex = Math.floor(Math.random() * (4 * 4 - 1));
        setTimeout(() => onTileClicked(allTiles[randomIndex]), i * 10);
    }
    setTimeout(() => {
        allTiles.forEach(tile => tile.tileRef.classList = 'tile');
    }, 10 * 400);
}

function onTileClicked(tileInfo) {
    const position = { ...tileInfo.position };

    function updatePosition(tileInfo, newPosition) {
        tileInfo.position = newPosition;
        tileInfo.tileRef.style.top = (newPosition.row * 160) + 'px';
        tileInfo.tileRef.style.left = (newPosition.column * 160) + 'px';
    }

    // check if to move row
    if (emptyCoord.row === position.row) {
        const row = grid[position.row];
        // move left / right
        if (position.column < emptyCoord.column) {
            for (let i = position.column; i < emptyCoord.column; i++) {
                updatePosition(row[i], { row: position.row, column: i + 1 });
            }
        } else {
            for (let i = emptyCoord.column + 1; i <= position.column; i++) {
                updatePosition(row[i], { row: position.row, column: i - 1 });
            }
        }
        emptyCoord = position;

        const newRow = row.filter(tileInfo => tileInfo != 0);
        newRow.splice(emptyCoord.column, 0, 0);
        grid[position.row] = newRow;
    }

    // check if to move column
    else if (emptyCoord.column === position.column) {
        const column = grid.map(row => row[position.column]);
        // move up / down
        if (position.row < emptyCoord.row) {
            for (let i = position.row; i < emptyCoord.row; i++) {
                updatePosition(column[i], { row: i + 1, column: position.column });
            }
        } else {
            for (let i = emptyCoord.row + 1; i <= position.row; i++) {
                updatePosition(column[i], { row: i - 1, column: position.column });
            }
        }
        emptyCoord = position;

        const newColumn = column.filter(tileInfo => tileInfo != 0);
        newColumn.splice(emptyCoord.row, 0, 0);
        for (let i = 0; i < grid.length; i++) {
            grid[i][position.column] = newColumn[i];
        }
    }

    if (allTiles.every(tile => tile.position.row === tile.originalPostion.row
        && tile.position.column === tile.originalPostion.column)) {
        gameMessageRef.innerHTML = 'Victory!';
    } else {
        gameMessageRef.innerHTML = '&nbsp;';
    }
}

init();
