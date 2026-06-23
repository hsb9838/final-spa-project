<template>
  <div class="movies-container">
    <h2>🎬 현재 상영작 목록</h2>

    <div v-if="store.isLoading" class="loading">
      데이터를 불러오는 중입니다...
    </div>
    <div v-else-if="store.errorMessage" class="error">
      {{ store.errorMessage }}
    </div>

    <template v-else>
      <div class="toolbar">
        <div class="sort-buttons">
          <span class="toolbar-label">정렬</span>
          <button
            v-for="option in sortOptions"
            :key="option.value"
            :class="['sort-btn', { active: sortType === option.value }]"
            @click="changeSort(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <p class="result-count">총 {{ sortedMovies.length }}편</p>
      </div>

      <div class="movie-list">
        <div
          v-for="movie in paginatedMovies"
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
              <p class="overview">
                {{
                  movie.overview
                    ? movie.overview.substring(0, 80) + "..."
                    : "줄거리 요약 정보가 없습니다."
                }}
              </p>
            </div>
          </RouterLink>
          <button
            class="favorite-btn"
            :class="{ active: store.isFavorite(movie.id) }"
            @click="store.toggleFavorite(movie)"
            :title="store.isFavorite(movie.id) ? '찜 해제' : '찜하기'"
          >
            {{ store.isFavorite(movie.id) ? "❤️" : "🤍" }}
          </button>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          이전
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          :class="['page-btn', 'page-number', { active: currentPage === page }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          다음
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useMovieStore } from "../stores/movieStore";

const store = useMovieStore();

const sortType = ref("default");
const currentPage = ref(1);
const itemsPerPage = 8;

const sortOptions = [
  { value: "default", label: "기본" },
  { value: "title", label: "제목순" },
  { value: "date", label: "개봉일순" },
  { value: "rating", label: "평점순" },
];

const sortedMovies = computed(() => {
  const list = [...store.movies];

  if (sortType.value === "title") {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortType.value === "date") {
    return list.sort((a, b) => b.release_date.localeCompare(a.release_date));
  }
  if (sortType.value === "rating") {
    return list.sort((a, b) => b.vote_average - a.vote_average);
  }
  return list;
});

const totalPages = computed(() => {
  return Math.ceil(sortedMovies.value.length / itemsPerPage);
});

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedMovies.value.slice(start, end);
});

const changeSort = (type) => {
  sortType.value = type;
  currentPage.value = 1;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

onMounted(() => {
  store.fetchMovies();
  document.title = "🎬 실시간 국내 극장 박스오피스";
});
</script>

<style scoped>
.movies-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}
.sort-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.toolbar-label {
  font-weight: 700;
  color: #333;
  margin-right: 4px;
}
.sort-btn {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}
.sort-btn.active {
  background: #ff4757;
  color: #fff;
  border-color: #ff4757;
}
.result-count {
  margin: 0;
  color: #666;
  font-size: 14px;
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
  transition: transform 0.2s;
  background: #fff;
  height: 100%;
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
  margin: 0 0 8px 0;
}
.overview {
  font-size: 0.9rem;
  color: #666;
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
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.favorite-btn.active {
  background: #ffe0e3;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  flex-wrap: wrap;
}
.page-btn {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-number.active {
  background: #1e272e;
  color: #fff;
  border-color: #1e272e;
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
