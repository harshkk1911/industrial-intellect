import { useEffect, useState } from 'react';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

export function useLocalLibrary() {
  const [watchLater, setWatchLater] = useState(() => read('ii-watch-later'));
  const [favourites, setFavourites] = useState(() => read('ii-favourites'));
  const [completed, setCompleted] = useState(() => read('ii-completed-videos'));

  useEffect(() => localStorage.setItem('ii-watch-later', JSON.stringify(watchLater)), [watchLater]);
  useEffect(() => localStorage.setItem('ii-favourites', JSON.stringify(favourites)), [favourites]);
  useEffect(() => localStorage.setItem('ii-completed-videos', JSON.stringify(completed)), [completed]);

  const toggle = (setter, id) => setter(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return {
    watchLater, favourites, completed,
    toggleWatchLater: id => toggle(setWatchLater, id),
    toggleFavourite: id => toggle(setFavourites, id),
    toggleCompleted: id => toggle(setCompleted, id),
    isSaved: id => watchLater.includes(id),
    isFavourite: id => favourites.includes(id)
  };
}
