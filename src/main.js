import pathFinder from "./pathFinder.js";
import utils from "./utils.js";

function main() {
    let p = new pathFinder(21, 41);
    let d = document.querySelectorAll(".dropdownContentButton");

    d.forEach(th => th.addEventListener("click", function (e) { utils.toggleDropdown(e); }));
    window.addEventListener("click", function (e) { utils.toggleDropdown(e); });
    document.getElementById("mainGrid").addEventListener("drop", function () { utils.setStartEnd(p) });
    document.getElementById("generateMazeButton").addEventListener("click", function () { p.generateMaze(); });
    document.getElementById("clearButton").addEventListener("click", function () { p.clearBoard(); });
    document.getElementById("randomWallsButton").addEventListener("click", function () { p.generateRandomWalls(); });
    document.getElementById("dijktraButton").addEventListener("click", function () { p.runDijk(); });
    document.getElementById("aStarButtonNoTieBreaker").addEventListener("click", function () { p.runAstarNoTieBreaker(); });
    document.getElementById("aStarButtonWithTieBreaker").addEventListener("click", function () { p.runAstarWithTieBreaker(); });
}

main();