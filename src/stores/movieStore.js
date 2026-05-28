import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useMovieStore = defineStore("movie", () => {
  // [1] State (상태 관리 구역)
  const movies = ref([]);
  // 세션 스토리지에서 기존 찜 목록이 있으면 가져오고, 없으면 빈 배열로 초기화합니다.
  const favorites = ref(JSON.parse(sessionStorage.getItem("favorites")) || []);

  // [2] UX 및 예외 처리를 위한 방어 상태 변수
  const isLoading = ref(false);
  const errorMessage = ref("");

  // [3] Actions: 외부 서버 통신 함수 (async/await 적용)
  const fetchMovies = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const API_KEY = "a08ae330a52d36e9efd4ce83f57a9d38";

      const movieParams = {
        api_key: API_KEY,
        language: "ko-KR",
        region: "KR",
        sort_by: "popularity.desc",
        include_adult: false,
        "release_date.gte": "2025-01-01",
        with_release_type: "2|3",
        page: 1,
      };

      // Axios를 통해 TMDB discover API 주소로 요청 전달
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: movieParams,
        },
      );

      const fetchedMovies = response.data.results; // 20개의 영화 배열 추출

      fetchedMovies.forEach((movie) => {
        const isAlreadyFavorite = favorites.value.some(
          (fav) => fav.id === movie.id,
        );
        movie.isFavorite = isAlreadyFavorite;
      });

      movies.value = fetchedMovies;
    } catch (error) {
      console.error("API 통신 에러 상세 내역:", error);
      errorMessage.value =
        "영화 데이터를 불러오는 데 실패했습니다. 통신 상태나 API Key를 확인해 주세요.";
    } finally {
      isLoading.value = false;
    }
  };

  // [4] Actions: 찜하기 토글 및 세션 스토리지 반영 로직
  const toggleFavorite = (movieId) => {
    const movie = movies.value.find((m) => m.id === movieId);
    if (movie) {
      movie.isFavorite = !movie.isFavorite;

      if (movie.isFavorite) {
        // 하트 활성화 시 전역 찜 목록 배열에 추가
        favorites.value.push(movie);
      } else {
        // 하트 해제 시 찜 목록에서 제외
        favorites.value = favorites.value.filter((m) => m.id !== movieId);
      }
      // 브라우저 세션 스토리지 금고에 실시간 저장
      sessionStorage.setItem("favorites", JSON.stringify(favorites.value));
    }
  };

  // 컴포넌트들이 사용할 수 있도록 상태와 함수들을 반환합니다.
  return {
    movies,
    favorites,
    isLoading,
    errorMessage,
    fetchMovies,
    toggleFavorite,
  };
});
