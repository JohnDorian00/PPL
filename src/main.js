import Vue from 'vue'
import App from './App.vue'

document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
document.body.style.backgroundColor = "#2d2d2d";

new Vue({
    el: "#app",
    render: function (render) {
        return render(App);
    }
})
