let blocks = [];
let gBoard;
let topMsg;

let pos = { x: 3, y: 3 };
function createBoard() {
    for (let i = 0; i < 15; ++i) {
        let block = createBlock("block", i + 1, `b${i}`);
        blocks.push(block);
        gBoard.appendChild(block);
    }
    let finalBlock = createBlock("block", 0, `b15`);
    finalBlock.classList.add("empty");
    blocks.push(finalBlock);
    gBoard.appendChild(finalBlock);
}

function createBlock(cls, inner, id) {
    let block = document.createElement("div");

    block.classList.add(cls);
    block.innerHTML = inner;
    block.id = id;

    return block;
}

function shuffleBoard() {
    let moveArr = [];
    for (let i = 0; i < 1000; ++i) {
        possibleMove(moveArr);
        let randIndex = Math.floor(Math.random() * moveArr.length);
        move(moveArr[randIndex]);
        moveArr = [];
    }
}

function move(dir) {
    /*We can get our 2d position on a 1d array by decoupling
        Our y dimension to a summation variable. in this case y*4
        */
    let p = pos.x + pos.y * 4;
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
    blocks[p].innerHTML = blocks[pos.x + pos.y * 4].innerHTML;
    blocks[pos.x + pos.y * 4].innerHTML = 0;
}

function possibleMove(moveArr) {
    if (pos.x < 3) moveArr.push(2);
    if (pos.x > 0) moveArr.push(8);
    if (pos.y < 3) moveArr.push(4);
    if (pos.y > 0) moveArr.push(1);
}

function blockClicked(e) {
    let elementId = parseInt(e.srcElement.id.replace(/^\D+/g, ""));

    let posTgt = { x: elementId % 4, y: Math.floor(elementId / 4) };
    let diff = { x: posTgt.x - pos.x, y: posTgt.y - pos.y };
    if (Math.abs(diff.x) > 1) return;
    if (Math.abs(diff.y) > 1) return;
    if (Math.abs(diff.y) >= 1 && Math.abs(diff.x) >= 1) return;
    if (diff.x === 1) move(2);
    if (diff.x === -1) move(8);
    if (diff.y === 1) move(4);
    if (diff.y === -1) move(1);
}

function setupClickEvents(el) {
    for (let i = 0; i < el.length; ++i) {
        el[i].addEventListener("click", blockClicked);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    gBoard = document.querySelector(".p15");
    topMsg = document.querySelector(".top-msg h2");
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
