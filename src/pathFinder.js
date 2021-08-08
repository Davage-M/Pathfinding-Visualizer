import Node from "./node.js"
import mazeNode from "./mazeNode.js"
import utils from "./utils.js"

export default class pathFinder {
    constructor(rRows, cCols) {
        this.rows = rRows;
        this.cols = cCols;
        this.mazeRows = (rRows - 1) / 2;
        this.mazeCols = (cCols - 1) / 2;
        this.nodes = [];
        this.mazeNodes = [];
        this.startX = 1;
        this.startY = 1;
        this.targetX = this.cols - 2;
        this.targetY = this.rows - 2;
        this.setNodes();
    }

    setNodes() {
        for (let i = 0; i < this.mazeRows; i++) {
            for (let j = 0; j < this.mazeCols; j++) {
                let n = new mazeNode(j, i);
                this.mazeNodes.push(n);
            }
        }

        this.mazeNodes.forEach(node => node.getNeighbors(this.mazeNodes, this.mazeRows, this.mazeCols));

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let n = new Node(j, i, "node", false);
                this.nodes.push(n);
            }
        }

        this.nodes.forEach(node => node.getNeighbors(this.nodes, this.cols, this.rows, this.cols));


        utils.setSE_style(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY);
        utils.huntKill(this.mazeNodes, this.mazeRows, this.mazeCols);
    }

    runAstarNoTieBreaker() {
        utils.aStar_dijk(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY, false);
    }

    runDijk() {
        utils.aStar_dijk(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY, false, true);
    }

    runAstarWithTieBreaker() {
        utils.aStar_dijk(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY, true);
    }

    generateMaze() {
        utils.convert(this.nodes, this.mazeNodes, this.rows, this.cols, this.mazeRows, this.mazeCols, this.startX, this.startY, this.targetX, this.targetY);
        utils.setSE_style(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY);
    }

    clearBoard() {
        utils.clearBoard(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY);
    }

    generateRandomWalls() {
        utils.getR(this.nodes);
    }

    setStyling() {
        utils.setSE_style(this.nodes, this.cols, this.startX, this.startY, this.targetX, this.targetY);
    }
}