BigInt.prototype.countAndFirst = function () {
    let bi = this, c = 0, p = 0
    while (bi > 0) {
        if (bi % 2n) {
            c++
        }
        p++
        bi /= 2n
    }
    return [c, p]
}

function transformKnownList(knowns, n) {
    let knownList = []
    for (let k of knowns) {
        knownList.push((k[0] - 1) * n * n + (k[1] - 1) * n + k[2] - 1)
    }
    return knownList
}

function initCoveredData(n, board) {
    let d = BigInt(n)
    let data = []
    let unit = 1n << (d * d - 1n)
    for (let i = 0n; i < d * d * d; i++) {
        let num = unit >> (i / d)
        num = num << d * d | unit >> (i % d + (i / d / d) * d)
        num = num << d * d | unit >> (i % d + (i / d % d) * d)
        num = num << d * d | unit >> (i % d + BigInt(board[i / d]) * d)
        data.push(num)
    }
    return data;
}

function findCovered(data, n, knownList) {
    let d = BigInt(n)
    let rowFlag = (1n << d * d * d) - 1n
    let colFlag = (1n << 4n * d * d) - 1n
    for (let known of knownList) {
        if (~(colFlag | ~data[known])) {
            console.log('初始数据冲突')
            return
        }
        [rowFlag, colFlag] = tryWith(data, n, rowFlag, colFlag, known)
    }
    let resultList = _findCovered(data, n, rowFlag, colFlag)
    if (resultList) {
        return [...knownList, ...resultList]
    }
    return
}

function _findCovered(data, n, rowFlag, colFlag) {
    let d = BigInt(n)
    if (!colFlag) {
        return []
    } else if (!rowFlag || !checkValid(data, n, rowFlag, colFlag)) {
        return
    }
    let tryRow = mostValuableRow(rowFlag, n)
    let [_rowFlag, _colFlag] = tryWith(data, n, rowFlag, colFlag, tryRow)
    let resultList = _findCovered(data, n, _rowFlag, _colFlag)
    if (resultList) {
        return [tryRow, ...resultList]
    } else {
        rowFlag = rowFlag & ~(1n << (d * d * d - 1n - tryRow))
        return _findCovered(data, n, rowFlag, colFlag)
    }
}

function mostValuableRow(rowFlag, n) {
    let d = BigInt(n)
    let minOptionCount = d + 1n
    let firstOptionRow
    for (let row = 0n, flag = ((1n << d) - 1n) << (d * d * d - d); row < d * d * d; row += d, flag >>= d) {
        let options = (rowFlag & flag) >> (d * d * d - d - row)
        if (options) {
            let [optionCount, firstOption] = options.countAndFirst()
            if (optionCount < minOptionCount) {
                minOptionCount = optionCount
                firstOptionRow = row + d - BigInt(firstOption)
            }
        }
    }
    return firstOptionRow
}

function checkValid(data, n, rowFlag, colFlag) {
    let d = BigInt(n)
    for (let row = 0n, flag = 1n << (d * d * d - 1n); row < d * d * d; row++, flag >>= 1n) {
        if (rowFlag & flag) {
            colFlag = colFlag & ~data[row]
        }
    }
    return !colFlag
}

function tryWith(data, n, rowFlag, colFlag, tryRow) {
    let d = BigInt(n)
    for (let row = 0n, flag = 1n << (d * d * d - 1n); row < d * d * d; row++, flag >>= 1n) {
        if (rowFlag & flag && data[row] & data[tryRow]) {
            rowFlag = rowFlag ^ flag
        }
    }
    colFlag = colFlag & ~data[tryRow]
    return [rowFlag, colFlag]
}

function calcSudoku(board, knowns, n) {
    let knownList = transformKnownList(knowns, n)
    let data = initCoveredData(n, board)
    return resultList = findCovered(data, n, knownList)
}

// function test4() {
//     let n = 4
//     let board4 = [
//         0, 0, 1, 1,
//         0, 0, 1, 1,
//         2, 2, 3, 3,
//         2, 2, 3, 3]
//     let knowns = [
//         [1, 1, 1],
//         [1, 2, 4],
//         [2, 2, 2]
//     ]
//     run(board4, knowns, 4)
// }