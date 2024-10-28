import { Event } from './types';

export async function parseICalFeed(url: string): Promise<Event[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    const events = text.split('BEGIN:VEVENT')
      .slice(1)
      .map(eventText => {
        const getField = (field: string): string => {
          const match = eventText.match(new RegExp(`${field}:(.+)`));
          return match ? match[1].trim() : '';
        };
        
        const getDateField = (field: string): Date => {
          const dateRegex = new RegExp(`${field};TZID=([^:]+):([0-9]{8}T[0-9]{6})`);
          const match = eventText.match(dateRegex);
          
          if (match) {
            const [, timezone, dateStr] = match;
            // Format: YYYYMMDDTHHMMSS
            const year = dateStr.slice(0, 4);
            const month = dateStr.slice(4, 6);
            const day = dateStr.slice(6, 8);
            const hour = dateStr.slice(9, 11);
            const minute = dateStr.slice(11, 13);
            const second = dateStr.slice(13, 15);
            
            // Construire la date au format ISO
            const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
            
            // Créer la date en prenant en compte le fuseau horaire
            return new Date(isoString);
          }
          
          // Fallback au cas où le format ne correspond pas
          const simpleDate = getField(field);
          return simpleDate ? new Date(simpleDate) : new Date();
        };

        return {
          id: getField('UID'),
          title: getField('SUMMARY'),
          description: getField('DESCRIPTION').replace(/\\n/g, '\n'),
          startDate: getDateField('DTSTART'),
          endDate: getDateField('DTEND'),
          location: getField('LOCATION'),
          status: getField('STATUS'),
        };
      });

    return events;
  } catch (error) {
    console.error('Error parsing iCal feed:', error);
    throw error;
  }
}