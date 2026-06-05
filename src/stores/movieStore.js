import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useMovieStore = defineStore("movie", () => {
  const movies = ref([]);
  const favorites = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  // 단일 영화 상세 정보 저장을 위한 전역 상태 변수
  const selectedMovie = ref(null);

  // 영화 목록 가져오기 함수
  const fetchMovies = async () => {
    // 🌟 [추가됨] 데이터 캐싱: 이미 영화 목록이 있으면 함수 즉시 종료 (새로고침 방지)
    if (movies.value.length > 0) return;

    isLoading.value = true;
    errorMessage.value = "";
    try {
      // 본인의 API KEY 적용 완료!
      const API_KEY = "a08ae330a52d36e9efd4ce83f57a9d38";
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          params: { api_key: API_KEY, language: "ko-KR" },
        },
      );
      movies.value = response.data.results;
    } catch (error) {
      errorMessage.value = "영화 목록을 불러오는데 실패했습니다.";
    } finally {
      isLoading.value = false;
    }
  };

  // 즐겨찾기 토글 함수
  const toggleFavorite = (movie) => {
    const index = favorites.value.findIndex((m) => m.id === movie.id);
    if (index === -1) {
      favorites.value.push(movie);
    } else {
      favorites.value.splice(index, 1);
    }
  };

  // 단일 영화 상세 정보 API 호출 함수
  const fetchMovieDetail = async (movieId) => {
    isLoading.value = true;
    errorMessage.value = "";
    selectedMovie.value = null;

    try {
      // 본인의 API KEY 적용 완료!
      const API_KEY = "a08ae330a52d36e9efd4ce83f57a9d38";
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;

      const response = await axios.get(url, {
        params: {
          api_key: API_KEY,
          language: "ko-KR",
        },
      });

      selectedMovie.value = response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        errorMessage.value = "존재하지 않거나 삭제된 영화 정보입니다.";
      } else {
        errorMessage.value = "서버 통신 중 에러가 발생했습니다.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    movies,
    favorites,
    isLoading,
    errorMessage,
    fetchMovies,
    toggleFavorite,
    selectedMovie,
    fetchMovieDetail,
  };
});
