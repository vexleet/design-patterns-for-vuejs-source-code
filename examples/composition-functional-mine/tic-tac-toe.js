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

/*
 * Vue integration layer
 */

export function useTicTacToe() {
  const boards = ref([initialBoard])
  const counter = ref('o')

  const _boardHistory = ref([])

  const move = ({col, row}) => {
    const {newBoard, newCounter, newBoardHistory} = makeMove(currentBoard.value, {row, col, counter: counter.value, boardHistory: _boardHistory.value})

    boards.value.push(newBoard)
    counter.value = newCounter
    _boardHistory.value = newBoardHistory
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

  return {
    currentBoard,
    makeMove: move,
    undo,
    redo
  }
}
