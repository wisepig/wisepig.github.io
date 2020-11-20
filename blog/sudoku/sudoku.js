document.querySelector('.sselector').addEventListener('select-changed', e => {
    sudoku.initBoard(e.value)
    document.querySelector('#color-selector .sselector-option:nth-child(1)').dispatchEvent(new Event('click'))
    let showCountEvent = new Event('show-count')
    showCountEvent.value = e.value
    document.querySelector("#color-selector").dispatchEvent(showCountEvent)
    document.querySelector("#value-selector").dispatchEvent(showCountEvent)
})

document.querySelector('#color-selector').addEventListener('select-changed', e => {
    if (e.value) {
        document.querySelector('#value-selector').dispatchEvent(new Event('clear-selected'))
        sudoku.selectColor(e.value)
    }
})

document.querySelector('#value-selector').addEventListener('select-changed', e => {
    if (e.value) {
        document.querySelector('#color-selector').dispatchEvent(new Event('clear-selected'))
        sudoku.selectValue(e.value)
    }
})

const cellSize = 60
const backColor = '#f6f6f6'
const colorPanel = [
    '#ffa7a7',
    '#ffd0a7',
    '#fffca7',
    '#c1ffa7',
    '#a7ffda',
    '#a7dfff',
    '#a8a7ff',
    '#e1a7ff',
    '#ffa7e8'
]
var sudoku = {
    isDrawing: false,
    dimension: 0,
    colorSelected: '0',
    valueSelected: '',
    board: [],
    known: [],
    ctx: '',
    initBoard: function (d) {
        this.dimension = d
        this.board = []
        this.knownList = []
        for (let i = 0; i < d * d; i++) {
            this.board.push('')
            this.known.push('')
        }
        let allCanvas = document.querySelector('.sudoku-board').children
        for (let i = 0; i < allCanvas.length; i++) {
            allCanvas[i].style.display = "none"
        }
        let canvas = document.querySelector('#canvas' + d)
        canvas.style.display = "block"
        canvas.onmousedown = e => {
            this.isDrawing = true
            this.drawBolck(e)
        }
        document.querySelector('body').addEventListener('mouseup', e => {
            this.isDrawing = false
        })
        canvas.onmousemove = e => {
            if (this.isDrawing) {
                this.drawBolck(e)
            }
        }
        this.ctx = canvas.getContext("2d")
        this.ctx.fillStyle = "#f6f6f6"
        this.ctx.fillRect(0, 0, this.dimension * cellSize, this.dimension * cellSize)
        this.ctx.strokeStyle = "#fff"
        this.ctx.lineWidth = 1
        for (let i = 1; i < d; i++) {
            this.ctx.moveTo(0, i * cellSize)
            this.ctx.lineTo(d * cellSize, i * cellSize)
        }
        for (let i = 1; i < d; i++) {
            this.ctx.moveTo(i * cellSize, 0)
            this.ctx.lineTo(i * cellSize, d * cellSize)
        }
        this.ctx.stroke()
    },
    selectColor: function (color) {
        this.colorSelected = color
        this.valueSelected = ''
    },
    selectValue: function (value) {
        this.colorSelected = ''
        this.valueSelected = value
    },
    drawBolck: function (e) {
        let row = Math.floor(e.offsetY / cellSize)
        let col = Math.floor(e.offsetX / cellSize)
        let index = row * this.dimension + col
        if (this.colorSelected) {
            this.board[index] = this.colorSelected
        } else if (this.valueSelected) {
            this.known[index] = this.valueSelected

        }
        if (this.board[index]) {
            this.ctx.fillStyle = colorPanel[this.board[index]]
        } else {
            this.ctx.fillStyle = backColor
        }
        this.ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1)
        if (this.known[index]) {
            this.ctx.fillStyle = '#000'
            this.ctx.font = "36px sans-serif"
            this.ctx.fillText(this.known[index], col * cellSize + 22, row * cellSize + 44)
        }
    }
}

document.querySelector('#control-calc').onclick = (e) => {
    let knownList = []
    for (let i = 0; i < sudoku.dimension * sudoku.dimension; i++) {
        if (sudoku.known[i]) {
            knownList.push([Math.floor(i / sudoku.dimension) + 1, i % sudoku.dimension + 1, Number(sudoku.known[i])])
        }
    }
    let resultList = calcSudoku(sudoku.board, knownList, sudoku.dimension)
    if (!resultList) {
        alert("no anwser")
        return
    }
    for (let i = 0; i < resultList.length; i++) {
        let position = Number(resultList[i])
        let row = Math.floor(position / sudoku.dimension / sudoku.dimension)
        let col = Math.floor(position / sudoku.dimension) % sudoku.dimension
        let value = position % sudoku.dimension + 1
        if (!sudoku.known[row * sudoku.dimension + col]) {
            sudoku.ctx.fillStyle = '#007bff'
            sudoku.ctx.font = "36px sans-serif"
            sudoku.ctx.fillText(value, col * cellSize + 22, row * cellSize + 44)
        }
    }
}

document.querySelector('#dimension-selector .sselector-option:nth-child(1)').dispatchEvent(new Event('click'))