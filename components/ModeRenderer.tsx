import React from 'react';
import HomeAnime from '../app/home/home-anime';
import HomeManga from '../app/home/home-manga';
import HomeMovies from '../app/home/home-movies';
import HomeTV from '../app/home/home-tv';
import { useMode } from '../context/ModeContext';

export default function ModeRenderer() {
  const { mode } = useMode();

  switch (mode) {
    case 'anime':
      return <HomeAnime />;
    case 'manga':
      return <HomeManga />;
    case 'movies':
      return <HomeMovies />;
    case 'tv':
      return <HomeTV />;
    default:
      return null;
  }
}
