// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAkiAmNZx9dMM8eE_oHRy0mFWc9IDXyGAU',
  authDomain: 'vue-school-21366.firebaseapp.com',
  databaseURL: 'https://vue-school-21366.firebaseio.com',
  projectId: 'vue-school-21366',
  storageBucket: 'vue-school-21366.appspot.com',
  messagingSenderId: '24909343997',
  appId: '1:24909343997:web:0386cf6a37cc380d65e294',
  measurementId: 'G-2JWL0X1QMZ'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
