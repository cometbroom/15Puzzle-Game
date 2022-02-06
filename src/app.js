document.addEventListener("DOMContentLoaded", () => {
    const gBoard = document.querySelector(".p15");
    const topMsg = document.querySelector(".top-msg h2");
    let blocks = [];

    topMsg.innerHTML = "Welcome";
    (function createBoard() {
        for (let i = 0; i < 15; ++i) {
            let block = createBlock("block", i + 1);
            blocks.push(block);
            gBoard.appendChild(block);
        }
        let finalBlock = createBlock("block", "");
        finalBlock.classList.add("empty");
        blocks.push(finalBlock);
        gBoard.appendChild(finalBlock);
    })();
});

function createBlock(cls, inner) {
    let block = document.createElement("div");

    block.classList.add(cls);
    block.innerHTML = inner;

    return block;
}
