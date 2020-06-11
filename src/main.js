import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
const fb = require("./fb");
import Alert from "./components/shared/Alert.vue";

Vue.config.productionTip = false;
Vue.component("myAlert", Alert);

// handle page reloads
let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
