<template>
  <div class="favorites-container">
    <h2>❤️ 내 찜 목록</h2>
    <p class="summary">
      총 {{ store.favorites.length }}편 · 평균 평점
      {{ averageRating }} / 10
    </p>

    <div v-if="store.favorites.length === 0" class="empty">
      아직 찜한 영화가 없습니다. 영화 목록에서 🤍 버튼을 눌러 추가해 보세요.
      <RouterLink to="/movies" class="link-btn">영화 목록 보기</RouterLink>
    </div>

    <div v-else class="movie-list">
      <div
        v-for="movie in store.favorites"
        :key="movie.id"
        class="movie-card-wrapper"
      >
        <RouterLink :to="`/movies/${movie.id}`" class="movie-card">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            alt="poster"
          />
          <div v-else class="no-poster">포스터 없음</div>
          <div class="card-content">
            <h3>{{ movie.title }}</h3>
            <p class="meta">
              ⭐ {{ movie.vote_average.toFixed(1) }} · 📅
              {{ movie.release_date }}
            </p>
          </div>
        </RouterLink>
        <button
          class="favorite-btn active"
          @click="store.toggleFavorite(movie)"
          title="찜 해제"
        >
          ❤️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useMovieStore } from "../stores/movieStore";

const store = useMovieStore();

const averageRating = computed(() => {
  if (store.favorites.length === 0) return "0.0";
  const sum = store.favorites.reduce(
    (acc, movie) => acc + movie.vote_average,
    0,
  );
  return (sum / store.favorites.length).toFixed(1);
});

onMounted(() => {
  document.title = "❤️ 내 찜 목록";
});
</script>

<style scoped>
.favorites-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.summary {
  color: #666;
  margin-bottom: 24px;
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
.no-poster {
  height: 300px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
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
  background: #ffe0e3;
  cursor: pointer;
  font-size: 18px;
}
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.link-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #ff4757;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 700;
}
</style>
