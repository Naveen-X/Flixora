export interface Manga {
  id: string;
  title: string;
  coverUrl: string;
  source: string;
}

export interface Chapter {
  id: string;
  number: string;
  title?: string;
  source: string;
}

export interface Page {
  uri: string;
}

export interface MangaParser {
  name: string;
  search(query: string): Promise<Manga[]>;
  getMangaDetails(manga: Manga): Promise<any>;
  getChapters(manga: Manga): Promise<Chapter[]>;
  getPages(chapter: Chapter): Promise<Page[]>;
}
