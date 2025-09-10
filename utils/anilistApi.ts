
const ANILIST_API_URL = 'https://graphql.anilist.co';

interface AnilistResponse<T> {
  data: T;
}

const fetchFromAnilist = async <T>(query: string, variables: Record<string, any>): Promise<AnilistResponse<T>> => {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string;
  };
  bannerImage: string;
  description: string;
  genres: string[];
  averageScore: number;
  episodes: number;
  status: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  season: string;
  seasonYear: number;
  source: string;
  studios: {
    nodes: {
      name: string;
    }[];
  };
  format: string;
}

interface PageData {
  Page: {
    media: Anime[];
  };
}

export const getTrendingAnime = async (): Promise<Anime[]> => {
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        media(sort: $sort, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          bannerImage
          description(asHtml: false)
          genres
          averageScore
          episodes
          status
        }
      }
    }
  `;

  const variables = {
    page: 1,
    perPage: 20,
    sort: ['TRENDING_DESC', 'POPULARITY_DESC'],
  };

  const { data } = await fetchFromAnilist<PageData>(query, variables);
  return data.Page.media;
};

export const getPopularAnime = async (): Promise<Anime[]> => {
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: $sort) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                extraLarge
                large
                medium
                color
              }
              bannerImage
              description(asHtml: false)
              genres
              averageScore
              episodes
              status
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
                }
              season
              seasonYear
              source
              studios {
                nodes {
                  name
                }
              }
              format
            }
          }
        } 
      `;

  const variables = {
    page: 1,
    perPage: 20,
    sort: ['FAVOURITES_DESC'],
  };

  const { data } = await fetchFromAnilist<PageData>(query, variables);
  return data.Page.media;
};

export const getTopRatedAnime = async (): Promise<Anime[]> => {
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: $sort) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                extraLarge
                large
                medium
                color
              }
              bannerImage
              description(asHtml: false)
              genres
              averageScore
              episodes
              status
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
                }
              season
              seasonYear
              source
              studios {
                nodes {
                  name
                }
              }
              format
            }
          }
        } 
      `;

  const variables = {
    page: 1,
    perPage: 20,
    sort: ['SCORE_DESC'],
  };

  const { data } = await fetchFromAnilist<PageData>(query, variables);
  return data.Page.media;
};

export const getAnimeDetails = async (id: number): Promise<Anime> => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        description(asHtml: false)
        genres
        averageScore
        episodes
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        season
        seasonYear
        source
        studios {
          nodes {
            name
          }
        }
        format
      }
    }
  `;

  const variables = {
    id,
  };

  const { data } = await fetchFromAnilist<{ Media: Anime }>(query, variables);
  return data.Media;
};

export const searchAnime = async (search: string): Promise<Anime[]> => {
  const query = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
        }
      }
    }
  `;

  const variables = {
    page: 1,
    perPage: 20,
    search,
  };

  const { data } = await fetchFromAnilist<PageData>(query, variables);
  return data.Page.media;
};
