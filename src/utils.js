const utils = {
    huntKill(cCells, mRows, mCols) {
        let current = cCells[0];

        while (current !== undefined) {
            current.isVisited = true;
            let vals = current.getUnvisitedNeighbors()

            if (vals !== -1) {
                let rIndex = Math.floor(Math.random() * vals.length);
                current.removeWallBetween(vals[rIndex]);
                current = vals[rIndex];
            }
            else if (vals === -1) {
                current = utils.hunt(cCells, mRows, mCols);
                if (current === undefined) {
                    return;
                }
            }
        }
    },

    hunt(cells, mRows, mCols) {
        for (let j = 0; j < mRows; j++) {
            for (let i = 0; i < mCols; i++) {

                let vals = cells[utils.getIndex(i, j, mCols)];

                if (vals.isVisited && vals.getUnvisitedNeighbors() !== -1) {

                    let rIndex = Math.floor(Math.random() * vals.getUnvisitedNeighbors().length);
                    let randomVals = vals.getUnvisitedNeighbors();
                    let randomVal = randomVals[rIndex];

                    vals.removeWallBetween(randomVal);
                    return randomVal;

                }
            }
        }
    },

    convert(nodes, mazeNodes, rows, cols, rRows, cCols, startX, startY, targetX, targetY) {

        nodes.forEach(node => node.reset());

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let n = nodes[utils.getIndex(j, i, cols)];
                n.isWall = true;
                n.changeStyle("nodeWall");
            }
        }

        for (let j = 0; j < rRows; j++) {
            for (let i = 0; i < cCols; i++) {

                let val = mazeNodes[utils.getIndex(i, j, cCols)];
                let iVal = (2 * i) + 1;
                let jVal = (2 * j) + 1;
                let convertedVal = nodes[utils.getIndex(iVal, jVal, cols)];

                convertedVal.isWall = false;
                convertedVal.changeStyle("node");

                if (!val.walls.down) {
                    nodes[utils.getIndex(iVal, 2 * (j + 1), cols)].isWall = false;
                    nodes[utils.getIndex(iVal, 2 * (j + 1), cols)].changeStyle("node");
                }
                if (!val.walls.right) {
                    nodes[utils.getIndex(2 * (i + 1), jVal, cols)].isWall = false;
                    nodes[utils.getIndex(2 * (i + 1), jVal, cols)].changeStyle("node");
                }

            }
        }

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                let val = nodes[utils.getIndex(i, j, cols)];


                if (val.dv.className === "nodeStart" || val.dv.className === "nodeEnd") {
                    val.isWall = false;


                }
            }
        }
        nodes[this.getIndex(startX, startY, cols)].isWall = false;
        nodes[this.getIndex(targetX, targetY, cols)].isWall = false;

    },

    removeFromArray(arr, elt) {

        let index = arr.indexOf(elt);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    getIndex(x, y, w) {
        return x + (y * w); // 
    },

    async aStar_dijk(nodes, cols, startX, startY, targetX, targetY, tieBreaker, dijk = false) {
        let running = true;
        let openSet = [];
        let closedSet = [];
        let targ = nodes[utils.getIndex(targetX, targetY, cols)];
        let start = nodes[utils.getIndex(startX, startY, cols)];
        start.dist = 0;
        start.h = utils.getHeuristic(start, targ, tieBreaker, dijk);
        start.f = start.h;
        let current;

        openSet.push(start);

        nodes.forEach(node => node.h = utils.getHeuristic(node, targ, tieBreaker, dijk));

        while (running) {
            if (!openSet.length > 0) {
                running = false;
                alert("No Solution");
                break;
            }

            let index = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[index].f) {
                    index = i
                }
            }

            current = openSet[index];

            if (current === targ) {
                running = false;
                break;
            }

            current.changeStyle("nodeVisit");
            utils.removeFromArray(openSet, current);
            closedSet.push(current);

            let n = current.neighbors;

            for (let i = 0; i < n.length; i++) {
                if (closedSet.includes(n[i])) {
                    continue;
                }

                let tentative = current.dist + 1;

                if (!openSet.includes(n[i]) || tentative < n[i].dist) {
                    if (!n[i].isWall) {
                        n[i].dist = tentative;
                        n[i].f = n[i].dist + n[i].h
                        n[i].parent = current;
                        if (!openSet.includes(n[i])) {
                            openSet.push(n[i]);
                        }
                    }
                }

            }

            await utils.sleep(15);

        }
        utils.retrace(targ);
    },

    async retrace(end) {
        let next;
        let current = end;
        let prev = null;

        while (current !== null) {
            next = current.parent;
            current.parent = prev;
            prev = current;
            current = next;
        }
        current = prev;

        while (current.parent !== null) {
            current.changeStyle("nodePath");
            current = current.parent
            await utils.sleep(50)
        }
    },

    clearBoard(nodes, cols, startX, startY, targetX, targetY) {
        nodes.forEach(node => node.reset());
        utils.setSE_style(nodes, cols, startX, startY, targetX, targetY);
    },


    getHeuristic(nNode, target, tieBreaker, dijk = false) {
        if (dijk) { return 0; }
        let dx = Math.abs(target.i - nNode.i);
        let dy = Math.abs(target.j - nNode.j);

        let d = dx + dy;

        //let D = 1.01; // Tie breaker
        let D = (tieBreaker) ? 1.01 : 1;
        return D * d;
    },

    setSE_style(nodes, cols, startX, startY, targetX, targetY) {
        nodes[utils.getIndex(startX, startY, cols)].changeStyle("nodeStart");
        nodes[utils.getIndex(targetX, targetY, cols)].changeStyle("nodeEnd");
    },

    toggleDropdown(e) {
        let dropButton = document.getElementById("dropButton");
        let dropContent = document.getElementById("dropContent");
        if (!e.target.matches("#dropButton")) {
            dropButton.style.backgroundColor = "rgb(47,38,38)";
            dropButton.style.color = "white";
            dropContent.style.display = "none";
        }
        else if (dropContent.style.display === "none" || dropContent.style.display === "") {
            dropButton.style.backgroundColor = "rgb(0,217,159)";
            dropButton.style.borderRadius = "5px";
            dropButton.style.color = "black";
            dropContent.style.display = "block";

        } else {
            dropButton.style.backgroundColor = "rgb(47,38,38)";
            dropButton.style.color = "white";
            dropContent.style.display = "none";

        }
    },

    getR(nodes) {

        for (let i = 0; i < nodes.length; i++) {
            let r = Math.random();
            if (nodes[i].dv.className === "nodeStart" || nodes[i].dv.className === "nodeEnd") {
                continue;
            }
            if (r < 0.2) {
                nodes[i].isWall = true;
                nodes[i].changeStyle("nodeWall");
            }
        }
    },

    setStartEnd(pPathFinder) {
        let dDragging = document.querySelector(".dragging");
        let type = dDragging.classList[0];
        let currentHovering = document.querySelector(".hovering");

        if (type === "nodeStart") {
            pPathFinder.startX = currentHovering.nodeRef.i;
            pPathFinder.startY = currentHovering.nodeRef.j;


        }
        else {
            pPathFinder.targetX = currentHovering.nodeRef.i;
            pPathFinder.targetY = currentHovering.nodeRef.j;
        }

        dDragging.nodeRef.changeStyle("node");
        currentHovering.classList.remove("hovering");
        pPathFinder.setStyling();

    }

}

export default utils;