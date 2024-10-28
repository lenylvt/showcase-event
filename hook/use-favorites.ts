// hooks/use-favorites.ts
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('eventFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      
      localStorage.setItem('eventFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
}