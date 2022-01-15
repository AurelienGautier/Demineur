var grid = document.getElementById("grid");
var flagsUsed = document.getElementById("flagsUsed");
var mines = document.getElementById("nbMines");
var gridWidth = 20;
var gridHeight = 10;
var firstClick = true;
var nbMines = 0;
var nbMinesFound = 0;
var flags = 0;
var playable = true;

// Classe correspondant aux cases à déminer
class Tile  {
    constructor(posX, posY)  {
        this.posX = posX;
        this.posY = posY;
        this.nbMine = 0;
        this.returned = false;
    }

    clicked(x, y, checkGameOver)  {
        if(playable)  {
            let thisCellule = document.getElementById(x+'-'+y);

            if(!this.returned && thisCellule.className !== "cellule-flag")  {
                this.returned = true;
                
                if(this.nbMine !== 0 && this.nbMine !== 9)  {
                    thisCellule.textContent = this.nbMine;
                }
                thisCellule.setAttribute("class", "cellule-"+this.nbMine);
            }

            if(checkGameOver === "check")  {
                checkForGameOver(this.nbMine);
            }
        }
    }

    right_clicked(x, y)  {
        if(playable)  {
            let thisCellule = document.getElementById(x+'-'+y);

            if(thisCellule.className == "cellule")  {
                thisCellule.setAttribute("class", "cellule-flag");
                flags++;

                if(this.nbMine===9)  {
                    nbMinesFound++;
                }
            }

            else if(thisCellule.className == "cellule-flag")  {
                thisCellule.setAttribute("class", "cellule");
                flags--;

                if(this.nbMine === 9)  {
                    nbMinesFound--;
                }
            }

            checkForWin();

            flagsUsed.innerHTML = flags;
        }
    }
}

// Génération de la grille
var squares = [];
for(let i = 0; i < gridHeight; i++)  {
    squares[i] = [i]
    for(let j = 0; j < gridWidth; j++)  {
        squares[i][j] = new Tile(i, j);
    }
}

for(let i = 0; i < gridHeight; i++)  {
    newLine = document.createElement("tr");
    newLine.setAttribute("id", i);

    for(let j = 0; j < gridWidth; j++)  {
        newCol = document.createElement("td");
        newCol.setAttribute("id", i+'-'+j);
        newCol.setAttribute("class", "cellule");
        newCol.style.border = "1px solid black";

        newLine.appendChild(newCol);
    }

    grid.appendChild(newLine);
}

gameLoop();

function gameLoop()  {
    for(let i = 0; i < gridHeight; i ++)  {
        for(let j = 0; j < gridWidth; j++)  {
            document.getElementById(i+"-"+j).addEventListener('contextmenu', (e)=>{
                e.preventDefault();
            })

            document.getElementById(i+"-"+j).onclick = function()  {
                if(firstClick)  {
                    firstClick = false;
        
                    // Génère les mines
                    for(let k = 0; k < gridHeight; k++)  {
                        for(let l = 0; l < gridWidth; l++)  {
                            if (Math.random() < 0.25 && ((k < i-2 || k > i+2) || (l < j-2 || l > j+2)))  {
                                squares[k][l].nbMine = 9;
                                nbMines++;
                            }
                        }
                    }
                    
                    mines.innerHTML = nbMines;
                    countMinesInArea();
                }

                squares[i][j].clicked(i, j, "check");

                if(squares[i][j].nbMine === 0)  {
                    discoverArea(i, j);
                }
            };

            document.getElementById(i+"-"+j).oncontextmenu = function()  {
                squares[i][j].right_clicked(i, j);
            }
        }
    }
}

function checkForWin()  {
    if(nbMines == nbMinesFound && !firstClick)  {
        for(let i=0; i<gridHeight; i++)  {
            for(let j=0; j<gridWidth; j++)  {
                squares[i][j].clicked(i, j, "check");
            }
        }

        playable = false;
    }
}

function checkForGameOver(number)  {
    if(number === 9)  {
        for(let i=0; i<gridHeight; i++)  {
            for(let j=0; j<gridWidth; j++)  {
                if(squares[i][j].nbMine===9)  {
                    squares[i][j].clicked(i,j);
                }
            }
        }

        playable = false;
    }
}

// Compte le nombre de mines autour de chaque case
function countMinesInArea()  {
    for(let i = 0; i < gridHeight; i++)  {
        for(let j = 0; j < gridWidth; j++)  {
            if(squares[i][j].nbMine == 9)  {
                let around = area(i, j);

                for(let k = 0; k < around.length; k++)  {
                    if(around[k].nbMine !== 9)  {
                        around[k].nbMine++;
                    }
                }
            }
        }
    }
}

// Découvre tous les 0 adjacents
function discoverArea(x, y)  {
    var squaresToDiscoverX = [];
    var squaresToDiscoverY = [];
    var nbToDiscover = 0;

    let around = area(x, y);
    console.log(around);
    for(let i = 0; i < around.length; i++)  {
        if(around[i].nbMine === 0 && !around[i].returned)  {
            squaresToDiscoverX[nbToDiscover] = around[nbToDiscover].posX;
            squaresToDiscoverY[nbToDiscover] = around[nbToDiscover].posY;
            nbToDiscover++;
        }

        around[i].clicked(around[i].posX, around[i].posY);
    }

    for(let i = 0; i < nbToDiscover; i++)  {
        if(squares[squaresToDiscoverX[i]][squaresToDiscoverY[i]].nbMine === 0)  {
            discoverArea(squaresToDiscoverX[i], squaresToDiscoverY[i]);
        }
    }

    // if(i != 0 && j != 0)  {
    //     if(squares[i-1][j-1].nbMine === 0 && !squares[i-1][j-1].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i-1;
    //         squaresToDiscoverY[nbToDiscover] = j-1;
    //         nbToDiscover++;
    //     }
    //     squares[i-1][j-1].clicked(i-1, j-1);
    // }
    // if(i != 0)  {
    //     if(squares[i-1][j].nbMine === 0 && !squares[i-1][j].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i-1;
    //         squaresToDiscoverY[nbToDiscover] = j;
    //         nbToDiscover++;
    //     }
    //     squares[i-1][j].clicked(i-1, j);
    // }
    // if(i != 0 && j != gridWidth-1)  {
    //     if(squares[i-1][j+1].nbMine === 0 && !squares[i-1][j+1].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i-1;
    //         squaresToDiscoverY[nbToDiscover] = j+1;
    //         nbToDiscover++;
    //     }
    //     squares[i-1][j+1].clicked(i-1, j+1);
    // }
    // if(j != 0)  {
    //     if(squares[i][j-1].nbMine === 0 && !squares[i][j-1].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i;
    //         squaresToDiscoverY[nbToDiscover] = j-1;
    //         nbToDiscover++;
    //     }
    //     squares[i][j-1].clicked(i, j-1);
    // }
    // if(j != gridWidth-1)  {
    //     if(squares[i][j+1].nbMine === 0 && !squares[i][j+1].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i;
    //         squaresToDiscoverY[nbToDiscover] = j+1;
    //         nbToDiscover++;
    //     }
    //     squares[i][j+1].clicked(i, j+1);
    // }
    // if(i != gridHeight-1 && j != 0)  {
    //     if(squares[i+1][j-1].nbMine === 0 && !squares[i+1][j-1].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i+1;
    //         squaresToDiscoverY[nbToDiscover] = j-1;
    //         nbToDiscover++;
    //     }
    //     squares[i+1][j-1].clicked(i+1, j-1);
    // }
    // if(i != gridHeight-1)  {
    //     if(squares[i+1][j].nbMine === 0 && !squares[i+1][j].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i+1;
    //         squaresToDiscoverY[nbToDiscover] = j;
    //         nbToDiscover++;
    //     }
    //     squares[i+1][j].clicked(i+1, j);
    // }
    // if(i != gridHeight-1 && j != gridWidth-1)  {
    //     if(squares[i+1][j+1].nbMine === 0 && !squares[i+1][j+1].returned)  {
    //         squaresToDiscoverX[nbToDiscover] = i+1;
    //         squaresToDiscoverY[nbToDiscover] = j+1;
    //         nbToDiscover++;
    //     }
    //     squares[i+1][j+1].clicked(i+1, j+1);
    // }
}


function area(x, y)  {
    let area = [];
    let index = 0;

    if(x !== 0 && y !== 0)  {
        area[index] = squares[x-1][y-1];
        index++;
    }

    if(x !== 0)  {
        area[index] = squares[x-1][y];
        index++;
    }

    if(x !== 0 && y !== gridWidth-1)  {
        area[index] = squares[x-1][y+1];
        index++;
    }

    if(y !== 0)  {
        area[index] = squares[x][y-1];
        index++;
    }

    if(y !== gridWidth-1)  {
        area[index] = squares[x][y+1];
        index++;
    }

    if(x !== gridHeight-1 && y !== 0)  {
        area[index] = squares[x+1][y-1];
        index++;
    }

    if(x !== gridHeight-1)  {
        area[index] = squares[x+1][y];
        index++;
    }
    
    if(x !== gridHeight-1 && y !== gridWidth-1)  {
        area[index] = squares[x+1][y+1];
        index++;
    }

    return area;
}