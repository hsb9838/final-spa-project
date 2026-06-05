<template>
  <div class="movies-container">
    <h2>🎬 현재 상영작 목록</h2>

    <div v-if="store.isLoading" class="loading">
      데이터를 불러오는 중입니다...
    </div>
    <div v-else-if="store.errorMessage" class="error">
      {{ store.errorMessage }}
    </div>

    <div v-else class="movie-list">
      <RouterLink
        v-for="movie in store.movies"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="movie-card"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          alt="poster"
        />
        <div class="card-content">
          <h3>{{ movie.title }}</h3>
          <p class="overview">
            {{
              movie.overview
                ? movie.overview.substring(0, 80) + "..."
                : "줄거리 요약 정보가 없습니다."
            }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMovieStore } from "../stores/movieStore";

const store = useMovieStore();

onMounted(() => {
  store.fetchMovies();
  document.title = "🎬 실시간 국내 극장 박스오피스";
});
</script>

<style scoped>
.movies-container {
  padding: 20px;
}
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.movie-card {
  text-decoration: none;
  color: inherit;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  background: #fff;
}
.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.movie-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.card-content {
  padding: 15px;
}
.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}
.overview {
  font-size: 0.9rem;
  color: #666;
}
.loading,
.error {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
}
.error {
  color: red;
}
</style>
