import {Tile} from "./Tile.js";

class Grid {
    constructor(gridWidth, gridHeight) {
        this.firstClick = true;
        this.width = gridWidth;
        this.height = gridHeight;
        this.gameLost = false;
        this.tiles = this.initTiles(
            this.width, 
            this.height
        );
        this.nbMines = 0;
        this.nbFlags = 0;
    }

    /*-------------------------------------------------*/

    initTiles(gridWidth, gridHeight) {
        let tiles = new Array;

        for(let i = 0; i < gridHeight; i++) {
            tiles[i] = new Array;

            for(let j = 0; j < gridWidth; j++) {
                tiles[i][j] = new Tile(i, j);
            }
        }

        return tiles;
    }

    /*-------------------------------------------------*/

    click(x, y) {
        if(this.firstClick) {
            this.firstClick = false;

            this.placeMines(x, y);
        }

        let actualTile = this.tiles[x][y];

        if(!actualTile.returned) {
            actualTile.clicked();

            if(actualTile.minesAround === 0 
               && actualTile.returned) {
                this.discoverArea(x, y);
            }
            else if(actualTile.minesAround === 9) {
                this.gameLost = true;
                this.gameOver();
            }
        }
        else if(actualTile.flagsAround === actualTile.minesAround) {
            this.discoverArea(x, y);
        }
    }

    /*-------------------------------------------------*/

    rightClick(x, y) {
        this.tiles[x][y].rightClicked();

        let around = this.area(x, y);
        if(this.tiles[x][y].flagged) {
            this.nbFlags++;

            for(let tile of around) {
                tile.flagsAround++;
            }
        }
        else {
            this.nbFlags--;

            for(let tile of around) {
                tile.flagsAround--;
            }
        }
    }

    /*-------------------------------------------------*/

    placeMines(x, y) {
        for(let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                if (this.canSetMine(i, j, x, y)) {
                    // Add mines
                    this.tiles[i][j].minesAround = 9;
                    this.nbMines++;

                    // Increment the mines number of tiles in area
                    let around = this.area(i, j);
                    
                    for(let i = 0; i < around.length; i++) {
                        if(around[i].minesAround !== 9) around[i].minesAround++;
                    }
                }
            }
        }
    }

    /*-------------------------------------------------*/

    canSetMine(cellPosX, cellPosY, clickPosX, clickPosY) {
        if(
            Math.random() < 0.25
            && (
                cellPosX < clickPosX - 2 
                || cellPosX > clickPosX + 2
                || cellPosY < clickPosY - 2 
                || cellPosY > clickPosY + 2
            )
        ) {
            return true;
        }

        return false;
    }

    /*-------------------------------------------------*/

    area(x, y) {
        let area = [];
        let index = 0;
    
        if(x !== 0 && y !== 0) {
            area[index] = this.tiles[x-1][y-1];
            index++;
        }
        if(x !== 0) {
            area[index] = this.tiles[x-1][y];
            index++;
        }
        if(x !== 0 && y !== this.width-1) {
            area[index] = this.tiles[x-1][y+1];
            index++;
        }
        if(y !== 0) {
            area[index] = this.tiles[x][y-1];
            index++;
        }
        if(y !== this.width-1) {
            area[index] = this.tiles[x][y+1];
            index++;
        }
        if(x !== this.height-1 && y !== 0) {
            area[index] = this.tiles[x+1][y-1];
            index++;
        }
        if(x !== this.height-1) {
            area[index] = this.tiles[x+1][y];
            index++;
        }
        if(x !== this.height-1 && y !== this.width-1) {
            area[index] = this.tiles[x+1][y+1];
            index++;
        }
    
        return area;
    }

    /*-------------------------------------------------*/

    discoverArea(x, y) {
        let squaresToDiscoverX = [];
        let squaresToDiscoverY = [];
        let nbToDiscover = 0;
    
        let around = this.area(x, y);
    
        for(let square of around) {
            if(square.minesAround === 0 && !square.returned) {
                squaresToDiscoverX[nbToDiscover] = square.posX;
                squaresToDiscoverY[nbToDiscover] = square.posY;
                nbToDiscover++;
            }
            else if(square.minesAround === 9) {
                this.gameLost = true;
                this.gameOver();
                return;
            }
    
            square.clicked(square.posX, square.posY, this.playable);
        }
    
        for(let i = 0; i < nbToDiscover; i++) {
            if(this.tiles[squaresToDiscoverX[i]][squaresToDiscoverY[i]].minesAround === 0) {
                this.discoverArea(squaresToDiscoverX[i], squaresToDiscoverY[i]);
            }
        }
    }

    /*-------------------------------------------------*/

    getTiles() {
        return this.tiles;
    }

    /*-------------------------------------------------*/

    gameOver() {
        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                if(this.tiles[i][j].minesAround === 9) {
                    this.tiles[i][j].clicked();
                }
            }
        }
    }

    /*-------------------------------------------------*/
}

export {Grid};
