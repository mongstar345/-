import { MapPin, Search, Navigation, Phone, Clock, Info, Building2, GraduationCap, BookOpen, Utensils, Coffee, Bus, ParkingCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { Input } from './ui/input';
import { useTheme } from '../contexts/ThemeContext';

interface Location {
  id: number;
  name: string;
  category: 'building' | 'facility' | 'dining' | 'service' | 'parking';
  description: string;
  icon: React.ElementType;
  coordinates?: string;
  phone?: string;
  hours?: string;
  floor?: string;
  image?: string;
  amenities?: string[];
}

export function CampusMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { colors } = useTheme();

  const locations: Location[] = [
    {
      id: 1,
      name: 'Engineering Building',
      category: 'building',
      description: 'Main building for Computer Science, Electrical, and Mechanical Engineering departments.',
      icon: Building2,
      coordinates: '33.3301° N, 44.3937° E',
      phone: '+964 1 234 5678',
      hours: '7:00 AM - 8:00 PM',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600',
      amenities: ['WiFi', 'Computer Labs', 'Lecture Halls', 'Study Areas'],
    },
    {
      id: 2,
      name: 'Central Library',
      category: 'facility',
      description: 'Three-floor library with extensive collection of books, journals, and digital resources.',
      icon: BookOpen,
      coordinates: '33.3305° N, 44.3942° E',
      phone: '+964 1 234 5679',
      hours: '8:00 AM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1598954560332-fd896fd5f339?w=600',
      amenities: ['Silent Study', 'Group Rooms', 'Computer Access', 'Printing'],
    },
    {
      id: 3,
      name: 'Student Center',
      category: 'facility',
      description: 'Hub for student activities, clubs, and social events.',
      icon: GraduationCap,
      coordinates: '33.3298° N, 44.3935° E',
      phone: '+964 1 234 5680',
      hours: '7:00 AM - 11:00 PM',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
      amenities: ['Student Lounge', 'Game Room', 'Meeting Rooms', 'Events Hall'],
    },
    {
      id: 4,
      name: 'Main Cafeteria',
      category: 'dining',
      description: 'Large dining hall serving breakfast, lunch, and dinner with variety of cuisines.',
      icon: Utensils,
      coordinates: '33.3302° N, 44.3940° E',
      phone: '+964 1 234 5681',
      hours: '7:00 AM - 9:00 PM',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
      amenities: ['Iraqi Cuisine', 'International Food', 'Vegetarian Options', 'Seating 500+'],
    },
    {
      id: 5,
      name: 'Campus Coffee Shop',
      category: 'dining',
      description: 'Cozy coffee shop perfect for study sessions and quick bites.',
      icon: Coffee,
      coordinates: '33.3300° N, 44.3938° E',
      phone: '+964 1 234 5682',
      hours: '7:00 AM - 8:00 PM',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600',
      amenities: ['Coffee & Tea', 'Pastries', 'WiFi', 'Outdoor Seating'],
    },
    {
      id: 6,
      name: 'Medical Center',
      category: 'service',
      description: 'On-campus health services for students and staff.',
      icon: Building2,
      coordinates: '33.3303° N, 44.3941° E',
      phone: '+964 1 234 5683',
      hours: '8:00 AM - 6:00 PM (Weekdays)',
      amenities: ['General Care', 'Emergency Services', 'Pharmacy', 'Counseling'],
    },
    {
      id: 7,
      name: 'Sports Complex',
      category: 'facility',
      description: 'Modern sports facilities including gym, pool, and courts.',
      icon: Building2,
      coordinates: '33.3297° N, 44.3933° E',
      phone: '+964 1 234 5684',
      hours: '6:00 AM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      amenities: ['Gym', 'Swimming Pool', 'Basketball Court', 'Tennis Courts'],
    },
    {
      id: 8,
      name: 'Main Parking Lot',
      category: 'parking',
      description: 'Primary parking area for students and visitors.',
      icon: ParkingCircle,
      coordinates: '33.3296° N, 44.3936° E',
      hours: '24/7',
      amenities: ['500+ Spaces', 'Security', 'EV Charging', 'Covered Area'],
    },
    {
      id: 9,
      name: 'Campus Shuttle Stop',
      category: 'service',
      description: 'Main shuttle bus stop connecting different areas of campus.',
      icon: Bus,
      coordinates: '33.3299° N, 44.3939° E',
      hours: '6:30 AM - 9:00 PM',
      amenities: ['Regular Schedule', 'Multiple Routes', 'Free for Students'],
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'building':
        return 'bg-blue-100 text-blue-700';
      case 'facility':
        return 'bg-purple-100 text-purple-700';
      case 'dining':
        return 'bg-orange-100 text-orange-700';
      case 'service':
        return 'bg-green-100 text-green-700';
      case 'parking':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buildings = locations.filter(l => l.category === 'building');
  const facilities = locations.filter(l => l.category === 'facility');
  const dining = locations.filter(l => l.category === 'dining');

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <header className={`${colors.bgPrimary} px-4 py-4 border-b ${colors.border}`}>
        <h1 className={`text-xl flex items-center gap-2 mb-4 ${colors.textPrimary}`}>
          <MapPin className="h-6 w-6" />
          Campus Map
        </h1>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${colors.textSecondary}`} />
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      {/* Map Placeholder */}
      <div className={`${colors.bgPrimary} border-b ${colors.border}`}>
        <div className="relative h-64 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Interactive Campus Map</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Open Full Map
              </Button>
            </div>
          </div>
          {/* Map markers simulation */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <div className="absolute bottom-16 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute bottom-24 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className={`${colors.bgPrimary} border-b ${colors.border} px-4`}>
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              All Locations
            </TabsTrigger>
            <TabsTrigger
              value="buildings"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Buildings
            </TabsTrigger>
            <TabsTrigger
              value="facilities"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Facilities
            </TabsTrigger>
            <TabsTrigger
              value="dining"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Dining
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-440px)]">
            <div className="p-4 space-y-4">
              {filteredLocations.map((location) => {
                const Icon = location.icon;
                return (
                  <Card key={location.id} className="hover:shadow-lg transition-shadow">
                    {location.image && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={location.image}
                          alt={location.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-3 left-3 ${getCategoryColor(location.category)}`}>
                          {location.category}
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{location.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {location.coordinates && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{location.coordinates}</span>
                          </div>
                        )}
                        {location.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{location.phone}</span>
                          </div>
                        )}
                        {location.hours && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{location.hours}</span>
                          </div>
                        )}
                      </div>

                      {location.amenities && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {location.amenities.map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="buildings" className="mt-0">
          <ScrollArea className="h-[calc(100vh-440px)]">
            <div className="p-4 space-y-3">
              {buildings.map((location) => {
                const Icon = location.icon;
                return (
                  <Card key={location.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{location.name}</h3>
                          <p className="text-xs text-gray-500">{location.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="facilities" className="mt-0">
          <ScrollArea className="h-[calc(100vh-440px)]">
            <div className="p-4 space-y-3">
              {facilities.map((location) => {
                const Icon = location.icon;
                return (
                  <Card key={location.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{location.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {location.hours}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="dining" className="mt-0">
          <ScrollArea className="h-[calc(100vh-440px)]">
            <div className="p-4 space-y-4">
              {dining.map((location) => {
                const Icon = location.icon;
                return (
                  <Card key={location.id}>
                    {location.image && (
                      <div className="h-32 overflow-hidden">
                        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{location.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                            <Clock className="h-3 w-3" />
                            {location.hours}
                          </p>
                        </div>
                      </div>
                      {location.amenities && (
                        <div className="flex flex-wrap gap-1">
                          {location.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}