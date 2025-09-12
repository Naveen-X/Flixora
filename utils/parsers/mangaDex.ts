import axios from 'axios';
import { Manga, Chapter, Page, MangaParser } from './types';

const MANGA_API_BASE_URL = 'https://api.mangadex.org';

// Data Models from SaikouTV Kotlin code
interface SearchResponse {
  result?: string;
  data?: Array<{ 
    id?: string;
    attributes?: { title?: { en?: string } };
    relationships?: Array<{ type?: string; attributes?: { fileName?: string } }>;
  }>;
  total?: number;
}

interface MangaResponse {
  result?: string;
  data?: Array<{ 
    id: string;
    attributes: { 
      volume?: string;
      chapter?: string;
      title?: string;
      translatedLanguage?: string;
      externalUrl?: string;
    }
  }>;
  total?: number;
}

interface ChapterResponse {
  result?: string;
  baseURL?: string;
  chapter?: { 
    hash?: string;
    data?: string[];
    dataSaver?: string[];
  };
}

export class MangaDex implements MangaParser {
  name = 'MangaDex';

  async search(query: string): Promise<Manga[]> {
    try {
      const response = await axios.get(`${MANGA_API_BASE_URL}/manga`, {
        params: {
          title: query,
          limit: 20,
          includes: ['cover_art'],
        },
      });
      const json: SearchResponse = response.data;
      return json.data?.map((manga: any) => ({
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        coverUrl: this.getCoverUrl(manga),
        source: this.name,
      })) || [];
    } catch (error) {
      console.error('Error searching MangaDex:', error);
      return [];
    }
  }

  async getMangaDetails(manga: Manga): Promise<any> {
    try {
      const response = await axios.get(`${MANGA_API_BASE_URL}/manga/${manga.id}`, {
        params: {
          includes: ['cover_art', 'author', 'artist'],
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching MangaDex details for id: ${manga.id}` , error);
      return null;
    }
  }

  async getChapters(manga: Manga): Promise<Chapter[]> {
    console.log('*** MangaDex getChapters called! ***');
    try {
      const list: Chapter[] = [];
      const totalChaptersResponse = await axios.get(`${MANGA_API_BASE_URL}/manga/${manga.id}/feed?limit=0`);
      const totalChaptersJson: MangaResponse = totalChaptersResponse.data;
      const totalChapters = totalChaptersJson.total || 0;
      console.log(`Total chapters reported by API: ${totalChapters}`);

      // Fetch chapters in chunks of 200, in reverse order of offset
      const offsets = [];
      for (let i = 0; i <= totalChapters; i += 200) {
        offsets.push(i);
      }
      for (const offset of offsets.reverse()) { // Iterate in reverse
        const response = await axios.get(`${MANGA_API_BASE_URL}/manga/${manga.id}/feed`, {
          params: {
            limit: 200,
            'order[volume]': 'desc',
            'order[chapter]': 'desc',
            offset: offset,
          },
        });
        });
        const json: MangaResponse = response.data;
        console.log(`Fetched ${json.data?.length || 0} chapters for offset ${offset}`);
        json.data?.forEach((chapterData: any) => {
          if (chapterData.attributes.translatedLanguage === 'en' && chapterData.attributes.externalUrl === null) {
            const chapterNumber = (chapterData.attributes.chapter || '').toString();
            const chapterTitle = chapterData.attributes.title;
            list.push({
              id: chapterData.id,
              number: chapterNumber,
              title: chapterTitle,
              source: this.name,
            });
          }
        });
      }
      // Sort chapters by number (assuming numeric chapters)
      list.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
      console.log(`Total chapters collected: ${list.length}`);
      return list;
    } catch (error) {
      console.error(`Error fetching MangaDex chapters for id: ${manga.id}`, error);
      return [];
    }
  }

  async getPages(chapter: Chapter): Promise<Page[]> {
    try {
      const response = await axios.get(`${MANGA_API_BASE_URL}/at-home/server/${chapter.id}`);
      const json: ChapterResponse = response.data;
      const { baseURL, chapter: chapterData } = json;
      if (baseURL && chapterData && chapterData.dataSaver) {
        return chapterData.dataSaver.map((page: string) => ({
          uri: `${baseURL}/data-saver/${chapterData.hash}/${page}`,
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching MangaDex chapter pages for id: ${chapter.id}`, error);
      return [];
    }
  }

  private getCoverUrl(manga: any): string {
    const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
    if (coverArt && coverArt.attributes && coverArt.attributes.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`;
    }
    return '';
  }
}