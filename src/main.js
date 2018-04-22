import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'
import 'buefy/lib/buefy.css'
//import 'cryptocoins-icons/webfont/cryptocoins.css'

Vue.use(Buefy)

new Vue({
  el: '#app',
  render: h => h(App)
})
