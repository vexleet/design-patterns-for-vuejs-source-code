import { createApp } from 'vue'
import App from './examples/renderless-password-mine/App.vue'
import AppWithCustomValidator from "./examples/renderless-password-mine/AppWithCustomValidator.vue";

createApp(AppWithCustomValidator).mount('#app')
