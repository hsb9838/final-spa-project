import { defineStore } from "pinia"; // [cite: 46]
import { ref, computed, watch } from "vue"; // [cite: 47]

export const useFavoritesStore = defineStore("favorites", () => {
  // [cite: 48]

  // 1. State (상태): 브라우저 스토리지에 저장된 데이터가 있으면 파싱해서 가져옵니다. [cite: 49]
  const savedFavorites =
    JSON.parse(localStorage.getItem("favorite_movies")) || []; // [cite: 50]
  const favoriteMovies = ref(savedFavorites); // [cite: 50]

  // 2. Getters (게터): 데이터를 계산해서 보여주는 안내원들 [cite: 51]
  // 2-1. 찜한 영화의 개수 [cite: 51]
  const totalFavorites = computed(() => favoriteMovies.value.length); // [cite: 52]

  // 2-2. [심화] 찜한 영화들의 평균 평점 계산 [cite: 53]
  const averageRating = computed(() => {
    // [cite: 53]
    if (favoriteMovies.value.length === 0) return 0; // [cite: 55]
    const sum = favoriteMovies.value.reduce(
      (acc, movie) => acc + movie.rating,
      0,
    ); // [cite: 56, 57]
    return (sum / favoriteMovies.value.length).toFixed(1); // 소수점 1자리까지 [cite: 58]
  });

  // 3. Actions (액션): 금고의 데이터를 수정할 수 있는 유일한 함수들 [cite: 64]
  const toggleFavorite = (movie) => {
    // [cite: 64]
    const index = favoriteMovies.value.findIndex((m) => m.id === movie.id); // [cite: 66]
    if (index === -1) {
      // [cite: 66]
      favoriteMovies.value.push(movie); // 목록에 없으면 새롭게 추가 [cite: 67]
    } else {
      favoriteMovies.value.splice(index, 1); // 이미 목록에 있으면 제거 (찜 취소) [cite: 70]
    }
  };

  const clearAllFavorites = () => {
    // [cite: 71]
    favoriteMovies.value = []; // [cite: 73]
  };

  // 4. [핵심 실무] Watch를 이용한 영구 저장 로직 [cite: 74]
  // favoriteMovies 배열에 변화가 생길 때마다 브라우저 로컬 스토리지에 덮어씁니다. [cite: 75]
  watch(
    // [cite: 75]
    favoriteMovies, // [cite: 77]
    (newVal) => {
      // [cite: 78]
      localStorage.setItem("favorite_movies", JSON.stringify(newVal)); // [cite: 79]
    },
    { deep: true }, // 배열 내부의 객체 변화까지 깊게 감지하기 위한 필수 옵션 [cite: 80]
  );

  // 컴포넌트들이 사용할 수 있도록 밖으로 꺼내줍니다. [cite: 83]
  return {
    favoriteMovies,
    totalFavorites,
    averageRating,
    toggleFavorite,
    clearAllFavorites,
  }; // [cite: 84]
});
