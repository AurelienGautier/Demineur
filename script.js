var grid = document.getElementById("grid");
var gridWidth = 30;
var gridHeight = 16;
var caseSize = 50;
var firstClick = true;
var nbMines = 0;
var nbMinesFound = 0;
var perdu = false;

// Classe correspondant aux cases à déminer
class Tile  {
    constructor(posX, posY)  {
        this.posX = posX;
        this.posY = posY;
        this.nbMine = 0;
        this.returned = false;
    }

    clicked(x, y)  {
        if(!this.returned && document.getElementById(x+'-'+y).className !== "cellule-flag")  {
            this.returned = true;
            
            if(this.nbMine !== 0 && this.nbMine !== 9)  {
                document.getElementById(x+'-'+y).textContent = this.nbMine;
            }
            document.getElementById(x+'-'+y).setAttribute("class", "cellule-"+this.nbMine);

            if(this.nbMine === 9)  {
                alert("T'as perdu, gnarf gnarf gnarf.");
                perdu = true;
            }
        }
    }

    right_clicked(x, y)  {
        if(document.getElementById(x+'-'+y).className == "cellule")  {
            document.getElementById(x+'-'+y).setAttribute("class", "cellule-flag");

            if(this.nbMine===9)  {
                nbMinesFound++;
            }

            if(nbMinesFound === nbMines)  {
                alert("jéjé t'as gagné poulette");
            }
        }

        else if(document.getElementById(x+'-'+y).className == "cellule-flag")  {
            document.getElementById(x+'-'+y).setAttribute("class", "cellule");
        }
    }
}

// Génération de la grille
var squares = [];
for(let i = 0; i < 16; i++)  {
    squares[i] = [i]
    for(let j = 0; j < 30; j++)  {
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



// Boucle de jeu

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
        
                    countMinesInArea();
                }

                squares[i][j].clicked(i, j);

                if(squares[i][j].nbMine === 0)  {
                    discoverArea(i, j);
                }
            };

            document.getElementById(i+"-"+j).oncontextmenu = function()  {
                squares[i][j].right_clicked(i, j);
            }
        }
    }


// Compte le nombre de mines autour de chaque case
function countMinesInArea()  {
    for(let i = 0; i < 16; i++)  {
        for(let j = 0; j < 30; j++)  {
            if(squares[i][j].nbMine == 9)  {
                if(i != 0 && j != 0)  {
                    if(squares[i-1][j-1].nbMine != 9)  {
                        squares[i-1][j-1].nbMine++;
                    }
                }
                if(i != 0)  {
                    if(squares[i-1][j].nbMine != 9)  {
                        squares[i-1][j].nbMine++;
                    }
                }
                if(i != 0 && j != 29)  {
                    if(squares[i-1][j+1].nbMine != 9)  {
                        squares[i-1][j+1].nbMine++;
                    }
                }
                if(j != 0)  {
                    if(squares[i][j-1].nbMine != 9)  {
                        squares[i][j-1].nbMine++;
                    }
                }
                if(j != 29)  {
                    if(squares[i][j+1].nbMine != 9)  {
                        squares[i][j+1].nbMine++;
                    }
                }
                if(i != 15 && j != 0)  {
                    if(squares[i+1][j-1].nbMine != 9)  {
                        squares[i+1][j-1].nbMine++;
                    }
                }
                if(i != 15)  {
                    if(squares[i+1][j].nbMine != 9)  {
                        squares[i+1][j].nbMine++;
                    }
                }
                if(i != 15 && j != 29)  {
                    if(squares[i+1][j+1].nbMine != 9)  {
                        squares[i+1][j+1].nbMine++;
                    }
                }
            }
        }
    }
}

// Découvre tous les 0 adjacents
function discoverArea(i, j)  {
    var squaresToDiscoverX = [];
    var squaresToDiscoverY = [];
    var nbToDiscover = 0;

    if(i != 0 && j != 0)  {
        if(squares[i-1][j-1].nbMine === 0 && !squares[i-1][j-1].returned)  {
            squaresToDiscoverX[nbToDiscover] = i-1;
            squaresToDiscoverY[nbToDiscover] = j-1;
            nbToDiscover++;
        }
        squares[i-1][j-1].clicked(i-1, j-1);
    }
    if(i != 0)  {
        if(squares[i-1][j].nbMine === 0 && !squares[i-1][j].returned)  {
            squaresToDiscoverX[nbToDiscover] = i-1;
            squaresToDiscoverY[nbToDiscover] = j;
            nbToDiscover++;
        }
        squares[i-1][j].clicked(i-1, j);
    }
    if(i != 0 && j != 29)  {
        if(squares[i-1][j+1].nbMine === 0 && !squares[i-1][j+1].returned)  {
            squaresToDiscoverX[nbToDiscover] = i-1;
            squaresToDiscoverY[nbToDiscover] = j+1;
            nbToDiscover++;
        }
        squares[i-1][j+1].clicked(i-1, j+1);
    }
    if(j != 0)  {
        if(squares[i][j-1].nbMine === 0 && !squares[i][j-1].returned)  {
            squaresToDiscoverX[nbToDiscover] = i;
            squaresToDiscoverY[nbToDiscover] = j-1;
            nbToDiscover++;
        }
        squares[i][j-1].clicked(i, j-1);
    }
    if(j != 29)  {
        if(squares[i][j+1].nbMine === 0 && !squares[i][j+1].returned)  {
            squaresToDiscoverX[nbToDiscover] = i;
            squaresToDiscoverY[nbToDiscover] = j+1;
            nbToDiscover++;
        }
        squares[i][j+1].clicked(i, j+1);
    }
    if(i != 15 && j != 0)  {
        if(squares[i+1][j-1].nbMine === 0 && !squares[i+1][j-1].returned)  {
            squaresToDiscoverX[nbToDiscover] = i+1;
            squaresToDiscoverY[nbToDiscover] = j-1;
            nbToDiscover++;
        }
        squares[i+1][j-1].clicked(i+1, j-1);
    }
    if(i != 15)  {
        if(squares[i+1][j].nbMine === 0 && !squares[i+1][j].returned)  {
            squaresToDiscoverX[nbToDiscover] = i+1;
            squaresToDiscoverY[nbToDiscover] = j;
            nbToDiscover++;
        }
        squares[i+1][j].clicked(i+1, j);
    }
    if(i != 15 && j != 29)  {
        if(squares[i+1][j+1].nbMine === 0 && !squares[i+1][j+1].returned)  {
            squaresToDiscoverX[nbToDiscover] = i+1;
            squaresToDiscoverY[nbToDiscover] = j+1;
            nbToDiscover++;
        }
        squares[i+1][j+1].clicked(i+1, j+1);
    }

    for(let i = 0; i < nbToDiscover; i ++)  {
        if(squares[squaresToDiscoverX[i]][squaresToDiscoverY[i]].nbMine === 0)  {
            discoverArea(squaresToDiscoverX[i], squaresToDiscoverY[i]);
        }
    }
}
