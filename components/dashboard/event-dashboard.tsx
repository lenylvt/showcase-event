'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Moon, Sun, Search } from 'lucide-react';
import { format } from 'date-fns';
import { EventCard } from './event-card';
import { useICalEvents } from '@/hook/use-ical-events';
import { useFavorites } from '@/hook/use-favorites';
import { Event } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ICAL_URL = 'https://www.addevent.com/feed/aahmgugdw.ics';

export function EventDashboard() {
  const { events, loading, error } = useICalEvents(ICAL_URL);
  const { favorites, toggleFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentTab, setCurrentTab] = useState("upcoming");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Add dark mode class if needed
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">Loading events... 🎮</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50 dark:bg-red-900">
      <div className="text-red-500 dark:text-red-400 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Error Loading Events</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );

  const filterEvents = (events: Event[]) => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === "all" || 
                         format(event.startDate, 'yyyy') === selectedYear;
      
      return matchesSearch && matchesYear;
    });
  };

  const currentDate = new Date();
  const pastEvents = events
    .filter(event => event.startDate < currentDate)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  
  const upcomingEvents = events
    .filter(event => event.startDate >= currentDate)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const availableYears = ["all", ...new Set(pastEvents.map(event => 
    format(event.startDate, 'yyyy')
  ))].sort((a, b) => b.localeCompare(a));

  return (
    <div className={`min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Première carte */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0">
          <CardHeader className="border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400">
                    Gaming Events
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {format(currentDate, 'PPPP')}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? 
                  <Sun className="h-5 w-5 text-yellow-500" /> : 
                  <Moon className="h-5 w-5 text-gray-500" />
                }
              </Button>
            </div>
          </CardHeader>
        </Card>
  
        {/* Deuxième carte */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0">
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
  
            <Tabs 
              defaultValue="upcoming" 
              className="space-y-6" 
              onValueChange={setCurrentTab}
            >
              {/* Contenu des onglets */}
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <TabsTrigger 
                  value="upcoming"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-500 dark:data-[state=active]:text-purple-400"
                >
                  Upcoming ({filterEvents(upcomingEvents).length})
                </TabsTrigger>
                <TabsTrigger 
                  value="past"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-500 dark:data-[state=active]:text-purple-400"
                >
                  Past ({filterEvents(pastEvents).length})
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-500 dark:data-[state=active]:text-purple-400"
                >
                  Favorites ({filterEvents(events.filter(e => favorites.includes(e.id))).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {filterEvents(upcomingEvents).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No upcoming events found</p>
                  </div>
                ) : (
                  filterEvents(upcomingEvents).map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isFavorite={favorites.includes(event.id)}
                      onFavorite={toggleFavorite}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                <Select 
                  value={selectedYear} 
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>
                        {year === "all" ? "All Years" : year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filterEvents(pastEvents).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No past events found</p>
                  </div>
                ) : (
                  filterEvents(pastEvents).map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isFavorite={favorites.includes(event.id)}
                      onFavorite={toggleFavorite}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                {filterEvents(events.filter(e => favorites.includes(e.id))).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No favorite events yet</p>
                  </div>
                ) : (
                  filterEvents(events.filter(e => favorites.includes(e.id)))
                    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
                    .map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isFavorite={favorites.includes(event.id)}
                        onFavorite={toggleFavorite}
                      />
                    ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}