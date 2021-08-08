import utils from "./utils.js"

export default class mazeNode {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.isVisited = false;
        this.walls = {
            up: true,
            down: true,
            left: true,
            right: true
        }
        this.neighbors = [];
    }

    getNeighbors(grid, maxRows, maxCols) {
        if (this.y < maxRows - 1) {
            let ind = utils.getIndex(this.x, this.y + 1, maxCols)
            this.neighbors.push(grid[ind]);
        }
        if (this.x < maxCols - 1) {
            let ind = utils.getIndex(this.x + 1, this.y, maxCols)
            this.neighbors.push(grid[ind]);
        }
        if (this.x > 0) {
            let ind = utils.getIndex(this.x - 1, this.y, maxCols)
            this.neighbors.push(grid[ind]);
        }
        if (this.y > 0) {
            let ind = utils.getIndex(this.x, this.y - 1, maxCols)
            this.neighbors.push(grid[ind]);
        }
    }

    getUnvisitedNeighbors() {
        let unVisited = [];
        for (let i = 0; i < this.neighbors.length; i++) {
            if (!this.neighbors[i].isVisited) {
                unVisited.push(this.neighbors[i]);
            }
        }

        if (unVisited.length > 0) {
            return unVisited;
        }
        else {
            return -1;
        }
    }

    removeWallBetween(cll) {
        let dx = this.x - cll.x;
        let dy = this.y - cll.y;

        if (dx === 1) {
            this.walls.left = false;
            cll.walls.right = false;
        }
        else if (dx === -1) {
            this.walls.right = false;
            cll.walls.left = false;
        }

        if (dy === 1) {
            this.walls.up = false;
            cll.walls.down = false;
        }
        else if (dy === -1) {
            this.walls.down = false;
            cll.walls.up = false;
        }
    }
}