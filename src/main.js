import Vue from 'vue'
import App from './App.vue'
import './style/jqx.base.css'

import Rows from "@/IERT/vue/tabel/flex-row";
import Columns from "@/IERT/vue/tabel/flex-collum";

document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
document.body.style.backgroundColor = "#2d2d2d";

Vue.component("columns", Columns);
Vue.component("rows", Rows);

new Vue({
  el: "#app",
  render: function (render) {
    return render(App);
  }
})
