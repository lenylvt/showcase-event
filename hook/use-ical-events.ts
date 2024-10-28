// hooks/use-ical-events.ts
import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { parseICalFeed } from '@/lib/ical-parser';

export function useICalEvents(url: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await parseICalFeed(url);
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
        setLoading(false);
      }
    };

    fetchEvents();
  }, [url]);

  return { events, loading, error };
}