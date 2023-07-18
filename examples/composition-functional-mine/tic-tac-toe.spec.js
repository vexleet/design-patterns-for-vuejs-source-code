import {createGame, initialBoard, makeMove, redoMove, undoMove} from "./tic-tac-toe.js";

describe('useTicTacToeFunctional', function () {
  it('initializes an empty board', () => {
    const expected = [
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ]

    expect(createGame(initialBoard)).toEqual(expected)
  })

  describe('makeMove', function () {
    it('returns an updated board', () => {
      const board = createGame()
      const {newBoard, newCounter} = makeMove(board, {
        col: 0,
        row: 0,
        counter: 'o',
        boardHistory: []
      })

      expect(newBoard).toEqual([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
      expect(newCounter).toBe('x')
    })

    it('should prevent player from choosing non-empty cell', () => {
      const board = createGame([
        ['o', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
      const {newBoard, newCounter} = makeMove(board, {
        row: 0,
        col: 0,
        counter: 'x',
        boardHistory: []
      })

      expect(newBoard).toEqual(board)
      expect(newCounter).toEqual('x')
    })

    it('should reset board history if its not empty', () => {
      const boardHistory = [
        [
          ['o', '-', '-'],
          ['-', '-', '-'],
          ['-', '-', '-']
        ]
      ]
      const board = createGame([
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ])
      const {newBoardHistory} = makeMove(board, {
        row: 0,
        col: 0,
        counter: 'o',
        boardHistory
      })

      expect(newBoardHistory).toEqual([])
    })
  });

  describe('undo', function () {
    it('should undo if there was a turn played', () => {
      const boardHistory = []

      const boards = createGame([[
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ],
        [
          ['o', '-', '-'],
          ['-', '-', '-'],
          ['-', '-', '-']
        ]])

      const {newBoardHistory, newCounter, newBoards} = undoMove({boards, boardHistory, counter: 'x'})

      expect(newCounter).toEqual('o')
      expect(newBoardHistory).toEqual([
        [
          ['o', '-', '-'],
          ['-', '-', '-'],
          ['-', '-', '-']
        ]
      ])
      expect(newBoards).toEqual([
        [
          ['-', '-', '-'],
          ['-', '-', '-'],
          ['-', '-', '-']
        ]
      ])
    })

    it('should do nothing if no turns have been played', () => {
      const boardHistory = []
      const boards = createGame([
        [
          ['-', '-', '-'],
          ['-', '-', '-'],
          ['-', '-', '-']
        ]
      ])

      const {newBoards, newCounter, newBoardHistory} = undoMove({boards, boardHistory, counter: 'o'})

      expect(newCounter).toEqual('o')
      expect(newBoards).toEqual([
        [
          ['-', '-', '-'],
          ['-', '-', '-'],
          ['-', '-', '-']
        ]
      ])
      expect(newBoardHistory).toEqual([])
    })
  });

  describe('redo', function () {
    it('should redo move if board history is not empty', () => {
      const boardHistory = [[
        ['o', 'x', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ]]

      const boards =
        createGame([
          [
            ['o', '-', '-'],
            ['-', '-', '-'],
            ['-', '-', '-']
          ]
        ])

      const {newBoardHistory, newCounter, newBoards} = redoMove({boards, boardHistory, counter: 'x'})

      expect(newCounter).toEqual('o')
      expect(newBoardHistory).toEqual([])
      expect(newBoards).toEqual(
        [
          [
            ['o', '-', '-'],
            ['-', '-', '-'],
            ['-', '-', '-']
          ],
          [
            ['o', 'x', '-'],
            ['-', '-', '-'],
            ['-', '-', '-']
          ]
      ])
    })
  });
});
