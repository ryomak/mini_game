
class Game {
    board;
    size = 4;
    status;
    tileSize = 75;

    randomPutValue = [2,4]
    constructor(element) {
        this.status = "init"
        this.board = new Array(this.size)
        element.style.width = `${this.tileSize*this.size}px`
        element.style.height = `${this.tileSize*this.size}px`

        for (let y = 0; y < this.size;y ++) {
            this.board[y] = new Array(this.size)
            for (let x = 0; x < this.size;x ++) {
                this.board[y][x]=null;
            }
        }

        for (let x = 0; x < this.size;x ++) {
            for (let y = 0; y < this.size;y ++) {
                const d = document.createElement('div')
                d.style.position = "absolute";
                d.style.top = `${y*this.tileSize}px`;
                d.style.left = `${x*this.tileSize}px`;
                d.style.width = `${this.tileSize}px`;
                d.style.height = `${this.tileSize}px`;
                d.style.border="solid 2px #f0fff0";
                d.style.boxSizing="border-box";
                d.style.background="#ffe4c4";
                element.appendChild(d)
            }
        }
    }

    init(blockCount) {
        let i =0;
        while(i< blockCount) {
            this.randomPut();
            i++
        }
    }


    canPut(x ,y) {
        return !this.board[y][x]
    }

    put(x ,y, value) {
        this.board[y][x] = new Tile(x,y,value,this.tileSize)
    }

    randomPut(value) {
        if (!value) {
            value = this.randomPutValue[Math.trunc(this.randomPutValue.length * Math.random())]
        }
        const available = new Array(0)
        for (let x = 0; x < this.size;x ++) {
            for (let y = 0; y < this.size;y ++) {
                if (this.canPut(x,y)) {
                    available.push({y:y,x:x})
                }
            }
        }
        if (available.length === 0) {
            this.status = "over"
            return
        }
        const one = available[Math.trunc(available.length * Math.random())];
        this.put(one.x, one.y,value)
    }

    render(){
        for (let y = 0; y < this.size;y ++) {
            for (let x = 0; x < this.size;x ++) {
                if (this.board[y][x]) {
                    this.board[y][x].render(x,y);
                }
            }
        }
    }

    renderOver(){
        for (let y = 0; y < this.size;y ++) {
            for (let x = 0; x < this.size;x ++) {
                if (this.board[y][x]) {
                    this.board[y][x].element.style.backgroundColor = "#999";
                    this.board[y][x].element.style.border = "solid 2px #a99";
                }
            }
        }
    }

    move(direction) {
        let result = this.copyBoard();
        if (direction === "left") {
            result = this.moveLeft(result)
        }else if(direction === "right") {
            result = this.reverseRow(result)
            result = this.moveLeft(result)
            result = this.reverseRow(result)

        }else if(direction === "up") {
            result = this.transpose(result)
            result = this.moveLeft(result)
            result = this.transpose(result)
        }else if(direction === "down") {
            result = this.reverseColumn(result)
            result = this.transpose(result)
            result = this.moveLeft(result)
            result = this.transpose(result)
            result = this.reverseColumn(result)
        }
        if (this.isEqual(result)) {
            return
        }
        if (this.status === "over") {
            this.renderOver();
            return
        }
        this.board = result
        this.randomPut(2);
        if (this.isGameEnd())return;
        this.render();
    }


    isGameEnd() {
        if (this.status === "over") {
            this.renderOver();
            let max = 0
            for (let y = 0; y < this.size;y ++) {
                for (let x = 0; x < this.size;x ++) {
                    if (this.board[y][x]) {
                       if (this.board[y][x].value > max) max = this.board[y][x].value
                    }
                }
            }
            window.alert("score: "+max)
            return true
        }
        return false
    }

    isEqual(result) {
        for (let y = 0; y < this.size;y ++) {
            for (let x = 0; x < this.size;x ++) {
                if (this.board[y][x] !== result[y][x]) {
                    return false
                }
            }
        }
        return true
    }

    moveLeft(bo) {
        const result = [];
        for (let index = 0; index < this.size; index++) {
            result.push(this.movedRow(bo[index]))
        }
        return result
    }

    // [2,0,0,4]=>[2,4,0,0]
    movedRow(list) {
        const notEmpty = list.filter(v => !!v);
        const remainLength = this.size - notEmpty.length
        for(let i =0; i < remainLength;i ++) {
            notEmpty.push(null);
        }

        return this.mergeRow(notEmpty);
    }

    // [2,2,0,0]=>[4,0,0,0]
    // [2,2,2,2]=>[4,4,0,0]
    mergeRow(list) {
        const merged = new Array(list.length)
        const deleteTile = []
        merged[0] = list[0];
        let index = 0
        for(let i = 1 ; i<list.length;i++ ) {
            if (!merged[index] || !list[i]) continue
            if (merged[index].isEqual(list[i])) {
                merged[index].merge(list[i])
                list[i].element.remove();
            }else{
                index ++
                merged[index] = list[i]
            }
        }
        return merged
    }

    copyBoard() {
        const result = [];
        for (let y = 0; y < this.size; y++) {
            result.push(this.board[y])
        }
        return result
    }

    transpose(bo) {
        const result = []
        for (let y = 0; y < this.size;y ++) {
            result[y] = []
            for (let x = 0; x < this.size;x ++) {
                result[y][x] = null
            }
        }
        for (let y = 0; y < this.size;y ++) {
            for (let x = 0; x < this.size;x ++) {
                result[y][x] = bo[x][y]
            }
        }
        return result
    }

    reverseRow(bo) {
        const result = []
        for (let y = 0; y < this.size;y ++) {
            result[y] = bo[y].reverse()
        }
        return result
    }

    reverseColumn(bo) {
        const result = []
        for (let y = 0; y < this.size;y ++) {
             result[this.size - (y+1)] = bo[y]
        }
        return result
    }


}

class Tile {
    tileSize;
    value;
    element;
    constructor(x,y, value, tileSize) {
        this.tileSize = tileSize;
        this.value = value;
        const d = boardElement()
        this.element = document.createElement('div')
        this.element.style.width = `${tileSize}px`;
        this.element.style.height = `${tileSize}px`;
        this.element.style.position = `absolute`;
        this.element.innerText = value;
        this.element.style.border="solid 2px #555";
        this.element.style.boxSizing="border-box";
        this.element.style.backgroundColor=this.color();
        this.element.style.display="flex";
        this.element.style.justifyContent="center";
        this.element.style.alignItems="center";
        this.element.style.transition="all 150ms ease-out";

        // 初回おく時だけ設定
        this.element.style.left = `${x*tileSize}px`;
        this.element.style.top = `${y*tileSize}px`;

        d.appendChild(this.element)

        this.createAnimation(false);
        setTimeout(()=>{
            this.createAnimation(true);
        },50);
    }

    createAnimation(display) {
        this.element.style.transform=`scale(${display?1:0})`
        this.element.style.opacity=`${display?1:0}`
    }

    isEqual(tile) {
        return this.value === tile.value
    }

    merge(tile) {
        return this.value += tile.value
    }

    render(x,y) {
        this.element.style.top = `${this.tileSize*y}px`;
        this.element.style.left = `${this.tileSize*x}px`;
        this.element.style.backgroundColor = this.color();
        this.element.innerText = this.value;

    }

    color() {
        switch (this.value) {
            case 2:
                return "#87cefa"
            case 4:
                return "#ffd700"
            case 8:
                return "#dc143c"
            case 16:
                return "#9932cc"
            case 32:
                return "#4b0082"
            case 64:
                return "#0000cd"
            case 128:
                return "#90ee90"
            case 256:
                return "#32cd32"
            case 512:
                return "#556b2f"
            case 1024:
                return "#008080"
            case 2048:
                return "#f8f8ff"
        }
        return "#6a5acd"
    }


}

window.onload = () =>{
    const board = boardElement();
    const game = new Game(board);
    game.init(3);

    window.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowDown":
                game.move("down")
                break;
            case "ArrowUp":
                game.move("up")
                break;
            case "ArrowLeft":
                game.move("left")
                break;
            case "ArrowRight":
                game.move("right")
                break;
            default:
                return;
        }
        e.preventDefault();
    })
}

function boardElement() {
    return document.getElementById("board")
}