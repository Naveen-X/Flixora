import axios from 'axios';

const MANGA_API_BASE_URL = 'https://api.mangadex.org';

export const getRecentlyAddedManga = async () => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: {
          createdAt: 'desc',
        },
        includes: ['cover_art'],
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching recently added manga:', error);
    return [];
  }
};

export const getPopularManga = async () => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: {
          followedCount: 'desc',
        },
        includes: ['cover_art'],
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return [];
  }
};

export const getTrendingManga = async () => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/manga`, {
      params: {
        limit: 20,
        order: {
          rating: 'desc',
        },
        includes: ['cover_art'],
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching trending manga:', error);
    return [];
  }
};

export const getMangaDetails = async (id: string) => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/manga/${id}`, {
      params: {
        includes: ['cover_art', 'author', 'artist'],
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching manga details for id: ${id}` , error);
    return null;
  }
};

export const getMangaChapters = async (id: string, offset: number = 0, limit: number = 50) => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/manga/${id}/feed`, {
      params: {
        limit: limit,
        'order[volume]': 'desc',
        'order[chapter]': 'desc',
        offset: offset,
        translatedLanguage: ['en'],
      },
    });
    // Filter for English chapters and those without external URLs
    const filteredChapters = response.data.data.filter((chapterData: any) => (
      chapterData.attributes.translatedLanguage === 'en' && chapterData.attributes.externalUrl === null
    ));
    return filteredChapters;
  } catch (error) {
    console.error(`Error fetching manga chapters for id: ${id}, offset: ${offset}`, error);
    return [];
  }
};

export const getChapterPages = async (id: string) => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/at-home/server/${id}`);
    console.log('getChapterPages response data:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapter pages for id: ${id}`, error);
    return null;
  }
};

export const searchManga = async (query: string) => {
  try {
    const response = await axios.get(`${MANGA_API_BASE_URL}/manga`, {
      params: {
        title: query,
        limit: 20,
        includes: ['cover_art'],
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error searching manga for query: ${query}`, error);
    return [];
  }
};
