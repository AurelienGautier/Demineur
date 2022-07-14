class Tile {
    constructor(x, y) {
        this.posX = x;
        this.posY = y;
        this.returned = false;
        this.flagged = false;
        this.minesAround = 0;
        this.flagsAround = 0;
    }

    clicked() {
        if(!this.flagged) {
            this.returned = true;
        }
    }

    rightClicked() {
        if(this.returned) return;
        
        if(!this.flagged) this.flagged = true;
        else if(this.flagged) this.flagged = false;
    }
}

export {Tile};
