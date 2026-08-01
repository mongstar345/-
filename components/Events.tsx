import { Calendar, Clock, MapPin, Users, Bookmark, Share2, Bell, Filter, ChevronRight, Video, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { Calendar as CalendarComponent } from './ui/calendar';

interface Event {
  id: number;
  title: string;
  description: string;
  category: 'academic' | 'social' | 'sports' | 'cultural' | 'career';
  date: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
    title?: string;
  };
  attendees: number;
  maxAttendees?: number;
  image?: string;
  isOnline?: boolean;
  isRegistered?: boolean;
  isPast?: boolean;
}

function getTitleColor(title?: string): string {
  if (!title) return 'text-gray-600';
  if (title.startsWith('Prof.')) return 'text-purple-600';
  if (title.startsWith('Asstprof')) return 'text-blue-600';
  if (title.startsWith('Letr')) return 'text-teal-600';
  if (title.startsWith('T.A')) return 'text-green-600';
  return 'text-gray-600';
}

export function Events() {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([1, 3]);
  const [savedEvents, setSavedEvents] = useState<number[]>([2]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events: Event[] = [
    {
      id: 1,
      title: 'AI & Machine Learning Workshop',
      description: 'Hands-on workshop covering fundamentals of AI and ML with practical examples.',
      category: 'academic',
      date: 'Nov 12, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Engineering Building - Hall A',
      organizer: {
        name: 'Prof. Richard Coleman',
        avatar: 'https://images.unsplash.com/photo-1601655781320-205e34c94eb1?w=400',
        title: 'Prof.',
      },
      attendees: 156,
      maxAttendees: 200,
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=600',
      isRegistered: true,
    },
    {
      id: 2,
      title: 'Annual Tech Career Fair',
      description: 'Meet representatives from top tech companies. Bring your resume!',
      category: 'career',
      date: 'Nov 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Main Campus - Sports Hall',
      organizer: {
        name: 'Career Center',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      },
      attendees: 423,
      maxAttendees: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    },
    {
      id: 3,
      title: 'Student Council Elections Debate',
      description: 'Hear from the candidates and ask your questions in this open forum.',
      category: 'social',
      date: 'Nov 13, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Main Auditorium',
      organizer: {
        name: 'Student Affairs',
        avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400',
      },
      attendees: 234,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
      isRegistered: true,
      isOnline: true,
    },
    {
      id: 4,
      title: 'Inter-Department Football Tournament',
      description: 'Cheer for your department in the annual football championship!',
      category: 'sports',
      date: 'Nov 18, 2025',
      time: '3:00 PM - 7:00 PM',
      location: 'University Stadium',
      organizer: {
        name: 'Sports Committee',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      },
      attendees: 567,
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600',
    },
    {
      id: 5,
      title: 'Cultural Night: Celebrating Diversity',
      description: 'Experience music, dance, and food from cultures around the world.',
      category: 'cultural',
      date: 'Nov 20, 2025',
      time: '7:00 PM - 11:00 PM',
      location: 'Student Center Plaza',
      organizer: {
        name: 'International Students Club',
        avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
      },
      attendees: 312,
      maxAttendees: 400,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
    },
    {
      id: 6,
      title: 'Research Paper Presentation Day',
      description: 'Graduate students present their latest research findings.',
      category: 'academic',
      date: 'Nov 10, 2025',
      time: '9:00 AM - 3:00 PM',
      location: 'Conference Center',
      organizer: {
        name: 'Letr. Ahmed Hadi',
        avatar: 'https://images.unsplash.com/photo-1654027879796-b9dee8caabb6?w=400',
        title: 'Letr.',
      },
      attendees: 89,
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600',
      isPast: true,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-700';
      case 'social':
        return 'bg-purple-100 text-purple-700';
      case 'sports':
        return 'bg-green-100 text-green-700';
      case 'cultural':
        return 'bg-pink-100 text-pink-700';
      case 'career':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleRegister = (eventId: number) => {
    setRegisteredEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleSave = (eventId: number) => {
    setSavedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const upcomingEvents = events.filter(e => !e.isPast);
  const myEvents = events.filter(e => registeredEvents.includes(e.id));
  const pastEvents = events.filter(e => e.isPast);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Events
          </h1>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Tabs defaultValue="upcoming" className="w-full">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="my-events"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              My Events ({myEvents.length})
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Past
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(event.category)}`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                      {event.isOnline && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          <Video className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white text-lg">{event.title}</h3>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={event.organizer.avatar} />
                          <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-gray-500">Organized by</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm">{event.organizer.name}</p>
                            {event.organizer.title && (
                              <span className={`text-xs ${getTitleColor(event.organizer.title)}`}>
                                {event.organizer.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Attendees</p>
                        <p className="text-sm flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees}
                          {event.maxAttendees && `/${event.maxAttendees}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleRegister(event.id)}
                        className={`flex-1 ${
                          registeredEvents.includes(event.id)
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {registeredEvents.includes(event.id) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Registered
                          </>
                        ) : (
                          'Register Now'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleSave(event.id)}
                        className={savedEvents.includes(event.id) ? 'text-blue-500' : ''}
                      >
                        <Bookmark className={`h-4 w-4 ${savedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="my-events" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-3">
              {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          {event.image && (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge className={`mb-2 text-xs ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </Badge>
                          <h3 className="text-sm mb-2">{event.title}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            {event.date} • {event.time}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No registered events</p>
                  <p className="text-sm text-gray-400 mt-1">Browse upcoming events to register</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <div className="p-4">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm">Events on {selectedDate?.toLocaleDateString()}</h3>
              {upcomingEvents.slice(0, 2).map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-3">
                    <h4 className="text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-3">
              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                        {event.image && (
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{event.title}</h3>
                        <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                        <Badge className="bg-gray-200 text-gray-700 text-xs">Completed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
