import { ref, readonly, computed } from 'vue'

/*
 * Core logic
 * Framework agnostics
 */

export const initialBoard = [
  ['-', '-', '-'],
  ['-', '-', '-'],
  ['-', '-', '-']
]

export function createGame(initialState = initialBoard) {
  return [...initialState]
}

export function makeMove(board, { row, col, counter, boardHistory }) {
  if(board[row][col] !== '-') {
    return {newBoard: board, newCounter: counter, newBoardHistory: boardHistory }
  }

  const newBoard = board.map((theRow, rowIdx) =>
    theRow.map((cell, colIdx) => {
      return rowIdx === row && colIdx === col ? counter : cell;
    }));

  const newCounter = counter === 'o' ? 'x' : 'o'

  return {
    newBoard,
    newCounter,
    newBoardHistory: boardHistory.length > 0 ? [] : boardHistory
  }
}

export function undoMove({boards, counter, boardHistory}) {
  // console.log(boards.length)
  if(boards.length === 1) return {newBoards: boards, newCounter: counter, newBoardHistory: boardHistory}

  const newBoardHistory = boardHistory.slice()
  const newBoards = boards.slice()


  newBoardHistory.push(newBoards.pop())
  const newCounter = counter === 'o' ? 'x' : 'o'

  return {
    newBoards,
    newCounter,
    newBoardHistory
  }
}

export function redoMove({boards, counter, boardHistory}) {
  if(boardHistory.length === 0) return {newBoards: boards, newCounter: counter, newBoardHistory: boardHistory}

  const newBoardHistory = boardHistory.slice()
  const newBoards = boards.slice()

  newBoards.push(newBoardHistory.pop())

  const newCounter = counter === 'o' ? 'x' : 'o'

  return {
    newBoardHistory,
    newCounter,
    newBoards
  }
}

export function isWinningMove(board, {row, col, counter}) {
  const isWinningRow = board[row].every(cell => cell === counter)
  const isWinningCol = board.every(row => row[col] === counter)
  const isWinningDiagonal = board.every((row, i) => row[i] === counter) || board.every((row, i) => row[board.length - 1 - i] === counter)

  return isWinningRow || isWinningCol || isWinningDiagonal
}

export function isDraw(board) {
  return board.every(row => row.every(cell => cell !== '-'))
}


/*
 * Vue integration layer
 */

export function useTicTacToe() {
  const boards = ref([createGame(initialBoard)])
  const counter = ref('o')
  const winner = ref(null)

  const _boardHistory = ref([])

  const move = ({col, row}) => {
    const counterSave = counter.value

    console.log(counterSave)

    const {newBoard, newCounter, newBoardHistory} = makeMove(currentBoard.value, {row, col, counter: counter.value, boardHistory: _boardHistory.value})

    boards.value.push(newBoard)
    counter.value = newCounter
    _boardHistory.value = newBoardHistory

    if(isWinningMove(currentBoard.value, {row, col, counter: counterSave})) {
      winner.value = counterSave
    }
    else if(isDraw(currentBoard.value)) {
      winner.value = 'tie'
    }
  }

  const currentBoard = computed(() => {
    return boards.value[boards.value.length - 1]
  })

  const undo = () => {
    const {newBoardHistory, newCounter, newBoards} = undoMove({boards: boards.value, counter: counter.value, boardHistory: _boardHistory.value})

    boards.value = newBoards
    counter.value = newCounter
    _boardHistory.value = newBoardHistory
  }

  const redo = () => {
    const {newBoardHistory, newCounter, newBoards} = redoMove({boards: boards.value, counter: counter.value, boardHistory: _boardHistory.value})

    boards.value = newBoards
    counter.value = newCounter
    _boardHistory.value = newBoardHistory
  }

  function resetBoard() {
    boards.value = [createGame(initialBoard)]
    counter.value = 'o'
    _boardHistory.value = []
    winner.value = null
  }


  return {
    currentBoard,
    makeMove: move,
    undo,
    redo,
    winner,
    resetBoard
  }
}
