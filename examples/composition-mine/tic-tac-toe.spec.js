import {useTicTacToe} from "./tic-tac-toe.js";

describe('useTicTacToe', () => {
  it('initializes state to an empty board', () => {
    const initialBoard = [
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ]

    const { currentBoard } = useTicTacToe()
    expect(currentBoard.value).toEqual(initialBoard)
  })

  it('supports seeding an initial state', () => {
    const initialBoard = [
      ['o', 'o', 'o'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ]

    const { currentBoard } = useTicTacToe([initialBoard])
    expect(currentBoard.value).toEqual(initialBoard)
  })

  describe('makeMove', function () {
    it('updates the board and adds new state', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })

      expect(game.boards.value.length).toEqual(2)
      expect(game.currentPlayer.value).toEqual('x')
      expect(game.currentBoard.value).toEqual([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('does not update the board if the space is already taken', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })
      game.makeMove({row: 0, col: 0 })

      expect(game.boards.value.length).toEqual(2)
      expect(game.currentPlayer.value).toEqual('x')
      expect(game.currentBoard.value).toEqual([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('shows a message if the game is a tie', () => {
      const game = useTicTacToe([
        [
          ['x', '-', 'x'],
          ['x', 'o', 'o'],
          ['o', 'x', 'o']
        ]
      ])

      game.makeMove({row: 0, col: 1 })

      expect(game.winner.value).toEqual('tie')
    })

    it('shows a message if the game is won', () => {
      const game = useTicTacToe([
        [
          ['o', '-', 'o'],
          ['x', 'o', 'x'],
          ['x', 'o', 'x']
        ]
      ])

      game.makeMove({row: 0, col: 1 })

      expect(game.winner.value).toEqual('o')
    })
  });

  describe('undo', function () {
    it('undoes the last move', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })
      game.undo()

      expect(game.boards.value.length).toEqual(1)
      expect(game.currentPlayer.value).toEqual('o')
      expect(game.currentBoard.value).toEqual([
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('does nothing if there are no moves to undo', () => {
      const game = useTicTacToe()

      game.undo()

      expect(game.boards.value.length).toEqual(1)
      expect(game.currentPlayer.value).toEqual('o')
      expect(game.currentBoard.value).toEqual([
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('can undo multiple moves', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })
      game.makeMove({row: 0, col: 1 })
      game.undo()

      expect(game.boards.value.length).toEqual(2)
      expect(game.currentPlayer.value).toEqual('x')
      expect(game.currentBoard.value).toEqual([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])

      game.undo()

      expect(game.boards.value.length).toEqual(1)
      expect(game.currentPlayer.value).toEqual('o')
      expect(game.currentBoard.value).toEqual([
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })
  })

  describe('redo', function () {
    it('redoes the last move', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })
      game.undo()
      game.redo()

      expect(game.boards.value.length).toEqual(2)
      expect(game.currentPlayer.value).toEqual('x')
      expect(game.currentBoard.value).toEqual([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('does nothing if there are no moves to redo', () => {
      const game = useTicTacToe()

      game.redo()

      expect(game.boards.value.length).toEqual(1)
      expect(game.currentPlayer.value).toEqual('o')
      expect(game.currentBoard.value).toEqual([
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('can redo multiple moves', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })
      game.makeMove({row: 0, col: 1 })
      game.undo()
      game.undo()
      game.redo()

      expect(game.boards.value.length).toEqual(2)
      expect(game.currentPlayer.value).toEqual('x')
      expect(game.currentBoard.value).toEqual([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])

      game.redo()

      expect(game.boards.value.length).toEqual(3)
      expect(game.currentPlayer.value).toEqual('o')
      expect(game.currentBoard.value).toEqual([
        ['o', 'x', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })

    it('cannot redo if a new move is made', () => {
      const game = useTicTacToe()

      game.makeMove({row: 0, col: 0 })
      game.undo()
      game.makeMove({row: 0, col: 1 })
      game.redo()

      expect(game.boards.value.length).toEqual(2)
      expect(game.currentPlayer.value).toEqual('x')
      expect(game.currentBoard.value).toEqual([
        ['-', 'o', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
    })
  })
})
