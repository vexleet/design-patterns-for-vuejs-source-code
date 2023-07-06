import { ref, readonly, computed } from 'vue'
export function useTicTacToe(initialState) {
  const initialBoard = [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
  ]
  const boards = ref(initialState || [initialBoard])
  const _boardHistory = ref([])

  const currentPlayer = ref('o')

  function _changePlayer() {
    currentPlayer.value = currentPlayer.value === 'o' ? 'x' : 'o'
  }

  function _isWinningMove(board, {row, col}) {
    const player = board[row][col]
    const isWinningRow = board[row].every(cell => cell === player)
    const isWinningCol = board.every(row => row[col] === player)
    const isWinningDiagonal = board.every((row, i) => row[i] === player) || board.every((row, i) => row[board.length - 1 - i] === player)

    return isWinningRow || isWinningCol || isWinningDiagonal
  }

  function _isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== '-'))
  }

  function resetBoard() {
    boards.value = initialState || [initialBoard]
    currentPlayer.value = 'o'
    _boardHistory.value = []
  }

  const winner = ref(null)

  function makeMove({row, col}) {
    const newState = [...boards.value[boards.value.length - 1]]
    const newRow = [...newState[row]]

    if(newState[row][col] !== '-') return

    if(_boardHistory.value.length > 0) {
      _boardHistory.value = []
    }

    newRow[col] = currentPlayer.value
    newState[row] = newRow

    boards.value.push(newState)

    if(_isWinningMove(newState, {row, col})) {
      winner.value = currentPlayer.value
    }
    else if(_isBoardFull(newState)) {
      winner.value = 'tie'
    }
    else {
      _changePlayer()
    }
  }

  function undo() {
    if(boards.value.length === 1) return

    _boardHistory.value.push(boards.value.pop())
    _changePlayer()
  }

  function redo() {
    if(_boardHistory.value.length === 0) return

    boards.value.push(_boardHistory.value.pop())
    _changePlayer()
  }

  return {
    makeMove,
    undo,
    redo,
    resetBoard,
    boards: readonly(boards),
    currentPlayer: readonly(currentPlayer),
    winner: readonly(winner),
    currentBoard: computed(() => boards.value[boards.value.length - 1])
  }
}
