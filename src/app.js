let blocks = [];
let gBoard;
let topMsg;
let gameMsg;

//Taken from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn(
        "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
    );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i])) return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

//Global position tracker of the empty tile.
let pos = {
    x: 3,
    y: 3,
    oneDim: function () {
        return this.x + this.y * 4;
    },
};

//
/*
Initialize board
*/
//

//Create our board's children elements.
function createBoard() {
    let block;

    for (let i = 0; i < 16; ++i) {
        if (i === 15) {
            block = createBlock("block", 0, `b${i}`);
            block.classList.add("empty");
        } else {
            block = createBlock("block", i + 1, `b${i}`);
        }
        blocks.push(block);
        gBoard.appendChild(block);
    }
    genGridArea(blocks, { x: 4, y: 4, spanX: 1, spanY: 1 });
}

//Takes all elements iterates over them and assigns a specific grid-area.
function genGridArea(els, options) {
    for (let i = 0; i < els.length; ++i) {
        //Get column number by modo our x dim
        let col = i % options.x;
        //Add area to column with span
        els[i].style.gridColumn = `${col + options.spanX}/span ${
            options.spanX
        }`;
        //Get row by dividing our y dim
        let row = Math.floor(i / options.y);
        //Add to style.
        els[i].style.gridRow = `${row + options.spanY}/ span ${options.spanY}`;
    }
}

function createBlock(cls, inner, id) {
    //Create a new div element
    let block = document.createElement("div");
    block.style.gridColumn =
        //Add class from parameter
        block.classList.add(cls);
    block.innerHTML = inner;
    //Number our blocks so we can handle the events better
    block.id = id;

    return block;
}

function shuffleBoard() {
    //Make a list of possible moves
    let moveArr = [];
    //Loop a thousand times for randomness
    for (let i = 0; i < 1000; ++i) {
        //Populate out possible moves array using logic
        possibleMove(moveArr);
        let randIndex = Math.floor(Math.random() * moveArr.length);
        //Choose one of the possible moves at random
        move(moveArr[randIndex]);
        //Clear our array for calculate new possible moves
        moveArr = [];
    }
}

//
/*
Move logics
*/
//

function move(dir) {
    /*We can get our 2d position on a 1d array by decoupling
        Our y dimension to a summation variable. in this case y*4
        */
    let p = pos.oneDim();
    //1 2 4 8 for performance as it's 2^0 2^1 2^2 2^3
    //1 for up move
    //2 for right
    //3 for down
    //4 for left
    switch (dir) {
        case 1:
            pos.y--;
            break;
        case 2:
            pos.x++;
            break;
        case 4:
            pos.y++;
            break;
        case 8:
            pos.x--;
            break;
    }
    //Swap our previous selected tile p with the new one.
    blocks[p].innerHTML = blocks[pos.oneDim()].innerHTML;
    //Set the tile that was the target of the move to empty.
    blocks[pos.oneDim()].innerHTML = "";
    winCheck();
}

function possibleMove(moveArr) {
    //If x is 3, that means there can be no right movement
    if (pos.x < 3) moveArr.push(2);
    //If x is 0, no left movement
    if (pos.x > 0) moveArr.push(8);
    //If y is 3, no down movement
    if (pos.y < 3) moveArr.push(4);
    //if y is 0 no up movement
    if (pos.y > 0) moveArr.push(1);
}

function winCheck() {
    let winArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

    let currentArr = blocks.map((x) => parseInt(x.innerHTML) || 0);

    if (currentArr.equals(winArr) === true) {
        gameMsg.innerHTML = "You win!";
        gameMsg.style.opacity = "1";
        gameMsg.style.height = "80%";
        gameMsg.style.width = "90%";
        gameMsg.style.fontSize = "30px";
    }
}

//
/*
Events
*/
//

function blockClicked(e) {
    //Replace any letter with empty so we only get the number (of the tile) in the id
    let elementId = parseInt(e.srcElement.id.replace(/^\D+/g, ""));

    //translate 1d ids to 2d
    let posTgt = { x: elementId % 4, y: Math.floor(elementId / 4) };
    //Subtract from our empty tile positionto find the difference
    let diff = { x: posTgt.x - pos.x, y: posTgt.y - pos.y };

    //Elminate too far candidates
    if (Math.abs(diff.x) > 1) return;
    if (Math.abs(diff.y) > 1) return;
    //Eliminate diagonals
    if (Math.abs(diff.y) >= 1 && Math.abs(diff.x) >= 1) return;
    //Move accordingly
    if (diff.x === 1) move(2);
    if (diff.x === -1) move(8);
    if (diff.y === 1) move(4);
    if (diff.y === -1) move(1);
}

function setupClickEvents(el) {
    //Add our click event to all the block elements
    for (let i = 0; i < el.length; ++i) {
        el[i].addEventListener("click", blockClicked);
    }
}

//
/*
DOM Loaded
*/
//

document.addEventListener("DOMContentLoaded", () => {
    gBoard = document.querySelector(".p15");
    topMsg = document.querySelector(".top-msg h2");
    gameMsg = document.querySelector(".game-msg");
    topMsg.innerHTML = "Welcome";
    createBoard();
    shuffleBoard();
    setupClickEvents(blocks);

    /*
	- When clicked on a block, see which side has empty block and move it there
	- Randomize numbers with unique random function
	- 



	*/
});
