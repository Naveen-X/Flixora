interface CacheData {
  trendingMovies: any[];
  genreSections: any[];
  movieDetails: { [key: number]: any };
  tvShowDetails: { [key: number]: any };
  trendingTVShows: any[];
  tvGenreSections: any[];
  trendingAnime: any[];
  popularAnime: any[];
  topRatedAnime: any[];
}

let appCache: CacheData = {
  trendingMovies: [],
  genreSections: [],
  movieDetails: {},
  tvShowDetails: {},
  trendingTVShows: [],
  tvGenreSections: [],
  trendingAnime: [],
  popularAnime: [],
  topRatedAnime: [],
};

export const setCache = (data: Partial<CacheData>) => {
  appCache = { ...appCache, ...data };
};

export const getCache = (): CacheData => {
  return appCache;
};

export const clearCache = () => {
  appCache = {
    trendingMovies: [],
    genreSections: [],
    movieDetails: {},
    tvShowDetails: {},
    trendingTVShows: [],
    tvGenreSections: [],
    trendingAnime: [],
    popularAnime: [],
    topRatedAnime: [],
  };
};