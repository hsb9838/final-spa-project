import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia"; // Pinia 불러오기

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// 반드시 mount(#app) 세팅보다 '위에' 먼저 장착되어야 합니다!
app.use(createPinia());
app.use(router);

app.mount("#app");
