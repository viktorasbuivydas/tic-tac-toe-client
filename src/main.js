import Vue from "vue";
require("dotenv").config();
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueRouter from "vue-router";
import axios from "axios";
import store from "./store";

axios.defaults.baseURL = process.env.VUE_APP_API;
import App from "./App";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Index from "./pages/Index.vue";
import Game from "./pages/Game.vue";
import NotFound from "./pages/NotFound.vue";

Vue.config.productionTip = false;

[BootstrapVue, IconsPlugin, VueRouter].forEach((x) => Vue.use(x));

const router = new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: "/", name: "Index", component: Index },
    { path: "/game", name: "Game", component: Game },

    { path: "/*", name: "NotFound", component: NotFound },
  ],
  mode: "history",
});

new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount("#app");
