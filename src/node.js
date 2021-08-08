import utils from "./utils.js"

export default class Node {
    constructor(i, j, clsName, wall) {
        this.i = i;
        this.j = j;
        this.isWall = wall;
        this.visited = false;
        this.dist = Infinity;
        this.h;
        this.f = Infinity;
        this.neighbors = [];
        this.parent = null;
        this.dv = document.createElement("div");
        this.dv.className = clsName;
        this.dv.id = `${this.i} ${this.j}`;
        this.dv.ref = this;
        this.setEventList();
    }

    setEventList() {
        this.dv.nodeRef = this;
        this.dv.setAttribute("draggable", true);

        this.dv.addEventListener("dragstart", function (e) {
            if (!(this.className === "nodeStart") && !(this.className === "nodeEnd")) {
                e.preventDefault();
            }
            else {
                this.classList.add("dragging");
            }
        });

        this.dv.addEventListener("dragend", function () {
            this.classList.remove("dragging");
        });

        this.dv.addEventListener("dragenter", function (e) {
            e.preventDefault();

            if (!(this.className === "nodeStart dragging") && !(this.className === "nodeEnd dragging")) {
                this.classList.add("hovering");
                this.style.filter = "brightness(50%)";
            }


        });


        this.dv.addEventListener("dragover", function (e) {
            e.preventDefault();
        });


        this.dv.addEventListener("dragleave", function () {
            if (!(this.className === "nodeStart dragging") && !(this.className === "nodeEnd dragging")) {
                this.classList.remove("hovering");
                this.style.filter = "brightness(100%)";

            }
        });

        this.dv.addEventListener("drop", function () {
            if (!(this.className === "nodeStart dragging") && !(this.className === "nodeEnd dragging")) {
                this.style.filter = "brightness(100%)";
            }
        });

        this.dv.addEventListener("mouseover", this.dragWall);

        this.dv.addEventListener("mousedown", this.downWall);


        let grid = document.getElementById("mainGrid");
        grid.appendChild(this.dv);
    }


    dragWall(e) {
        if (this.className !== "nodeStart" && this.className !== "nodeEnd") {
            if (e.buttons === 1) {
                this.className = "nodeWall";
                this.nodeRef.isWall = true;

            }
            if (e.buttons === 4) {
                this.className = "node";
                this.nodeRef.isWall = false;
            }
        }
    }

    downWall(e) {
        if (this.className !== "nodeStart" && this.className !== "nodeEnd") {
            if (e.buttons === 1) {
                this.className = "nodeWall";
                this.nodeRef.isWall = true;
            }
            if (e.buttons === 4) {
                this.className = "node";
                this.nodeRef.isWall = false;
            }
        }
    }

    getNeighbors(grid, xLength, yLength, wid) {
        if (this.j < yLength - 1) {
            let ind = utils.getIndex(this.i, this.j + 1, wid)
            this.neighbors.push(grid[ind]);
        }
        if (this.i < xLength - 1) {
            let ind = utils.getIndex(this.i + 1, this.j, wid);
            this.neighbors.push(grid[ind]);
        }
        if (this.i > 0) {
            let ind = utils.getIndex(this.i - 1, this.j, wid);
            this.neighbors.push(grid[ind]);
        }
        if (this.j > 0) {
            let ind = utils.getIndex(this.i, this.j - 1, wid);
            this.neighbors.push(grid[ind]);
        }
    }

    changeStyle(name) {
        this.dv.className = `${name}`;
    }

    reset() {
        this.isWall = false;
        this.visited = false;
        this.dist = Infinity;
        this.f = Infinity;
        this.parent = null;
        this.changeStyle("node");
    }



}