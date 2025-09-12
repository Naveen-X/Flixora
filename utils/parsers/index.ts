import { MangaDex } from './mangaDex';
import { MangaParser } from './types';

const parsers: MangaParser[] = [
  new MangaDex(),
];

export const getParsers = () => parsers;

export const getDefaultParser = () => parsers[0];

export const getParser = (name: string) => parsers.find(p => p.name === name);
