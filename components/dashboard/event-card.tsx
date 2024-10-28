// components/dashboard/event-card.tsx
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, Tv } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Event } from '@/lib/types';
import categories from '../../public/category.json';

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
}

function categorizeEvent(title: string) {
  for (const category of categories) {
    if (category.subCategories.some(sub => title.toLowerCase().includes(sub.toLowerCase()))) {
      return category;
    }
  }
  return {
    mainCategory: "",
    color: "border-gray-500",
  };
}

export function EventCard({ event, isFavorite, onFavorite }: EventCardProps) {
  const { mainCategory, color } = categorizeEvent(event.title);
  const timeRemaining = event.startDate > new Date() 
    ? formatDistanceToNow(event.startDate, { addSuffix: true })
    : null;

  return (
    <Card className={`mb-4 overflow-hidden border-l-4 hover:shadow-lg transition-all duration-200 ${color}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFavorite(event.id)}
                className={`ml-2 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
            <Badge className="mr-1"></Badge>
            <Badge className="mr-1"></Badge>
            <Badge className="mr-1"></Badge>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">
          {event.description === "Reminder" ? null : event.description}
        </p>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{format(event.startDate, 'PPP')} at {format(event.startDate, 'p')}</span>
          </div>
          
          {timeRemaining && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>{timeRemaining}</span>
            </div>
          )}
          
          {event.location && (
            <Button
                as="a"
                href={event.location}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors duration-200"
            >
              <Tv className="h-5 w-5" />
              <span>Watch Stream</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}