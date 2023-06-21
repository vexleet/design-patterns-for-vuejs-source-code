import {computed} from "vue";

export function isMatching(password, confirmation) {
  if(!password || !confirmation) return false
  return password === confirmation
}

export function calcComplexity(val) {
  if(!val) return 0

  if(val.length >=10) return 3
  if(val.length >=7) return 2
  if(val.length >= 5) return 1

  return 0
}


export default {
  props: {
    minComplexity: {
      type: Number,
      default: 3,
    },
    validator: {
      type: Function,
    },
    complexityValidator: {
      type: Function,
    },
    password: {
      type: String,
    },
    confirmation: {
      type: String,
    },
  },
  setup(props, {slots}) {
    const matching = computed(()=> isMatching(props.password, props.confirmation))
    const complexity = computed(()=> props.complexityValidator ? props.complexityValidator(props.password) : calcComplexity(props.password))

    function validatePassword() {
      return matching.value && complexity.value >= props.minComplexity
    }

    const valid = computed(()=>
      props.validator ?
        props.validator({password: props.password, confirmation: props.confirmation, matching: matching.value, complexity: complexity.value})
        : validatePassword())

    return ()=> slots.default({
      matching: matching.value,
      complexity: complexity.value,
      valid: valid.value,
    })
  }
}
