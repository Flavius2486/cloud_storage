import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from "vue-cookies";

createApp(App).use(store).use(VueCookies).use(router).mount("#app");
