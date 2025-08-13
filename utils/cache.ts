interface CacheData {
  trendingMovies: any[];
  genreSections: any[];
  movieDetails: { [key: number]: any }; // Add a cache for movie details
}

let appCache: CacheData = {
  trendingMovies: [],
  genreSections: [],
  movieDetails: {},
};

export const setCache = (data: Partial<CacheData>) => {
  appCache = { ...appCache, ...data };
  console.log("Cache: Data set. Current cache:", appCache);
};

export const getCache = (): CacheData => {
  console.log("Cache: Data retrieved. Current cache:", appCache);
  return appCache;
};

export const clearCache = () => {
  appCache = {
    trendingMovies: [],
    genreSections: [],
    movieDetails: {},
  };
  console.log("Cache: Cleared.");
};
