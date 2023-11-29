import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from "vue-cookies";
import VueSelect from "vue-select";

import "vue-select/dist/vue-select.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas, far, fab);

createApp(App)
  .use(store)
  .use(VueCookies)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .component("v-select", VueSelect)
  .mount("#app");
