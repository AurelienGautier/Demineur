import {Grid} from './Grid.js';

var gridWidth = 20;
var gridHeight = 10;

var htmlGrid = document.getElementById('grid');
var grid = new Grid(gridWidth, gridHeight);

/*-------------------------------------------------*/

for(let i = 0; i < gridHeight; i++) {
    let newLine = document.createElement('tr');

    for(let j = 0; j < gridWidth; j++) {
        let newCol = document.createElement('td');
        
        // Creating attributes to cells
        newCol.setAttribute('id', i+'-'+j);
        newCol.setAttribute('class', 'cellule');
        newCol.style.border = '1px solid black';

        // On left click
        newCol.onclick = function() {
            if(!grid.gameLost) {
                grid.click(i, j);
                reload();
            }
        }

        // On right click
        newCol.addEventListener('contextmenu', (e)=>{
            if(!grid.gameLost) {
                e.preventDefault();
                grid.rightClick(i, j);
                reload();
            }
        })

        newLine.appendChild(newCol);        
    }

    htmlGrid.appendChild(newLine);
}

/*-------------------------------------------------*/

function reload() {
    let htmlFlagsNumber = document.getElementById('flagsUsed');
    let htmlMinesNumber = document.getElementById('nbMines');

    htmlFlagsNumber.textContent = grid.nbFlags;
    htmlMinesNumber.textContent = grid.nbMines;

    let tiles = grid.getTiles();
    let htmlRows = document.getElementsByTagName('tr');

    for(let i = 0; i < gridHeight; i++) {
        let htmlCols = htmlRows[i].querySelectorAll('td');

        for(let j = 0; j < gridWidth; j++) {
            if(tiles[i][j].returned) {
                let number = tiles[i][j].minesAround;
                htmlCols[j].className += ' cellule-' + number;
    
                if(number === 9) htmlCols[j].textContent = '💣';
                else if(number !== 0) htmlCols[j].textContent = number;
            }
            else if(tiles[i][j].flagged) {
                htmlCols[j].textContent = '🚩';
            }
            else {
                htmlCols[j].textContent = '';
            }
        }
    }
}

/*-------------------------------------------------*/