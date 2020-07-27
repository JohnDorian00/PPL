import Vue from 'vue'
import App from './App.vue'
import './style/jqx.base.css'

document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
document.body.style.backgroundColor = "#2d2d2d";

new Vue({
  el: "#app",
  render: function (render) {
    return render(App);
  }
})
