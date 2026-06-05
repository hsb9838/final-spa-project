import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MovieDetailView from "../views/MovieDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/movies",
      name: "movies",
      component: () => import("../views/MoviesView.vue"),
    },
    {
      path: "/movies/:id",
      name: "movie-detail",
      component: MovieDetailView,
    },
  ],
  // 🌟 [추가됨] 뒤로가기 시 스크롤 위치를 기억하는 마법의 코드
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // 저장된 위치가 있으면 거기로 이동
    } else {
      return { top: 0 }; // 새 페이지면 맨 위로
    }
  },
});

export default router;
