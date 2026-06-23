<template>
  <div class="search-container">
    <h2>🔍 검색 결과</h2>
    <p v-if="keyword" class="search-keyword">
      "<strong>{{ keyword }}</strong>" 검색 결과
    </p>

    <div v-if="store.isLoading" class="loading">
      데이터를 불러오는 중입니다...
    </div>
    <div v-else-if="store.errorMessage" class="error">
      {{ store.errorMessage }}
    </div>
    <div v-else-if="!keyword" class="empty">
      검색어를 입력해 주세요.
    </div>
    <div v-else-if="filteredMovies.length === 0" class="empty">
      "{{ keyword }}"에 해당하는 영화가 없습니다.
    </div>

    <div v-else class="movie-list">
      <div
        v-for="movie in filteredMovies"
        :key="movie.id"
        class="movie-card-wrapper"
      >
        <RouterLink :to="`/movies/${movie.id}`" class="movie-card">
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            alt="poster"
          />
          <div class="card-content">
            <h3>{{ movie.title }}</h3>
            <p class="meta">
              ⭐ {{ movie.vote_average.toFixed(1) }} · 📅
              {{ movie.release_date }}
            </p>
          </div>
        </RouterLink>
        <button
          class="favorite-btn"
          :class="{ active: store.isFavorite(movie.id) }"
          @click="store.toggleFavorite(movie)"
        >
          {{ store.isFavorite(movie.id) ? "❤️" : "🤍" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "../stores/movieStore";

const route = useRoute();
const store = useMovieStore();

const keyword = computed(() => {
  const q = route.query.q;
  return typeof q === "string" ? q.trim() : "";
});

const filteredMovies = computed(() => {
  if (!keyword.value) return [];

  const lowerKeyword = keyword.value.toLowerCase();
  return store.movies.filter((movie) => {
    return movie.title.toLowerCase().includes(lowerKeyword);
  });
});

onMounted(() => {
  store.fetchMovies();
  document.title = keyword.value
    ? `🔍 "${keyword.value}" 검색 결과`
    : "🔍 영화 검색";
});

watch(keyword, (newKeyword) => {
  document.title = newKeyword
    ? `🔍 "${newKeyword}" 검색 결과`
    : "🔍 영화 검색";
});
</script>

<style scoped>
.search-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.search-keyword {
  color: #555;
  margin-bottom: 20px;
}
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.movie-card-wrapper {
  position: relative;
}
.movie-card {
  text-decoration: none;
  color: inherit;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  transition: transform 0.2s;
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
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}
.meta {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 18px;
}
.favorite-btn.active {
  background: #ffe0e3;
}
.loading,
.error,
.empty {
  text-align: center;
  padding: 50px;
  font-size: 1.1rem;
  color: #666;
}
.error {
  color: red;
}
</style>
