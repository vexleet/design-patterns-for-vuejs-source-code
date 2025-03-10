<template>
  <renderless-password
      :password="input.password"
      :confirmation="input.confirmation"
      :validator="customValidator"
      :complexity-validator="customComplexityValidator"
      v-slot="{matching, complexity, valid}"
  >

    <div class="wrapper">
      <div class="field">
        <label for="password">Password</label>
        <input v-model="input.password" id="password"/>
      </div>
      <div class="field">
        <label for="confirmation">Confirmation</label>
        <input v-model="input.confirmation" id="confirmation"/>
      </div>
      <div class="complexity-field">
        <div class="complexity" :class="complexityStyle(complexity)"></div>
      </div>
      <div class="field">
        <button :disabled="!valid">Submit</button>
      </div>
    </div>

    <p>Matches: {{matching}}</p>
    <p>Complexity: {{complexity}}</p>
  </renderless-password>
</template>

<script>
import RenderlessPassword from "./renderless-password";
import {reactive} from "vue";

export default {
  components: {
    RenderlessPassword
  },
  setup() {
    const input = reactive({
      password: '',
      confirmation: ''
    })

    const complexityStyle = (complexity) => {
      if(complexity >= 3) return 'high'
      if(complexity >= 2) return 'mid'
      if(complexity >= 1) return 'low'
    }

    const customValidator = ({password, confirmation, matching, complexity}) => {
      if(!matching) return false
      if(complexity < 2) return false

      return true
    }

    const customComplexityValidator = (password) => {
      if(password.length < 8) return 0
      if(password.length < 12) return 1
      if(password.length < 16) return 2
      return 3
    }

    return {
      input,
      complexityStyle,
      customValidator,
      customComplexityValidator
    }
  }
}
</script>

<style>
.wrapper {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
  margin: 5px 0;
}

input {
  height: 30px;
  font-size: 1.5rem;
}

.complexity-field {
  width: 100%;
}

.complexity {
  transition: 0.2s;
  height: 10px;
}

.high {
  width: 100%;
  background: lime;
}

.mid {
  width: 66%;
  background: yellow;
}

.low {
  width: 33%;
  background: red;
}

button {
  height: 30px;
  background: none;
  border: none;
  font-size: 1.5rem;
  background: steelblue;
  color: white;
  padding: 4px 0;
  width: 100%;
  box-sizing: content-box;
}

button:disabled {
  opacity: 0.5;
}
</style>
