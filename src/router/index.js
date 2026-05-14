import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MoviesView from "../views/MoviesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", // 기본 주소
      name: "home",
      component: HomeView,
    },
    {
      path: "/movies", // 영화 목록 주소
      name: "movies",
      component: MoviesView,
    },
  ],
});

export default router;
