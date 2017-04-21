// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'
import Firebase from 'firebase'

Vue.use(VueFire)

Vue.config.productionTip = false

let google = new Firebase.auth.GoogleAuthProvider();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  }
})
