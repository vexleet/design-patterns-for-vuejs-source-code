<script>
import {defineComponent, watch} from 'vue'
import {useTicTacToe} from "./tic-tac-toe";

export default defineComponent({
  name: "tic-tac-toe-app",
  setup() {
    const {boards, currentBoard, makeMove, undo, redo, winner, resetBoard} = useTicTacToe()

    watch(winner, (newVal) => {
      if(newVal === 'tie') {
        alert('Tie!')
        resetBoard()
      } else if (newVal) {
        alert(`${newVal} won!`)
        resetBoard()
      }
    })

    return {
      boards,
      currentBoard,
      makeMove,
      undo,
      redo
    }
  }
})
</script>

<template>
  <div>
    <div v-for="(row, rowIdx) in currentBoard" :key="rowIdx" class="row">
      <div v-for="(col, colIdx) in row" @click="makeMove({row: rowIdx, col: colIdx})" :key="colIdx" class="col">
        {{col}}
      </div>
    </div>

    <button class="button" @click="undo">Undo</button>
    <button class="button" @click="redo">Redo</button>
  </div>
</template>

<style>
.row {
  display: flex;
}
.col {
  border: 1px solid black;
  height: 50px;
  width: 50px;
}

.button {
  display: block;
  margin: 10px auto 0;
}
</style>
