import { Search, Users, Calendar, MapPin, Heart, UserPlus, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  members: number;
  president: {
    name: string;
    avatar: string;
  };
  nextEvent?: string;
  isJoined?: boolean;
  trending?: boolean;
}

export function Clubs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedClubs, setJoinedClubs] = useState<number[]>([1, 3]);

  const clubs: Club[] = [
    {
      id: 1,
      name: 'Computer Science Club',
      category: 'Technology',
      description: 'Coding competitions, hackathons, and tech talks for CS enthusiasts.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      members: 234,
      president: {
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      },
      nextEvent: 'Hackathon - Nov 15',
      isJoined: true,
      trending: true,
    },
    {
      id: 2,
      name: 'Photography Club',
      category: 'Arts',
      description: 'Capture moments, learn photography techniques, and showcase your work.',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600',
      members: 156,
      president: {
        name: 'Sara Ali',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
      nextEvent: 'Photo Walk - Nov 12',
      trending: true,
    },
    {
      id: 3,
      name: 'Debate Society',
      category: 'Academic',
      description: 'Develop critical thinking and public speaking through structured debates.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
      members: 89,
      president: {
        name: 'Omar Khaled',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      },
      nextEvent: 'Regional Competition - Nov 20',
      isJoined: true,
    },
    {
      id: 4,
      name: 'Music Society',
      category: 'Arts',
      description: 'From classical to modern, all music lovers welcome.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
      members: 198,
      president: {
        name: 'Layla Ahmed',
        avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
      },
      nextEvent: 'Annual Concert - Dec 1',
    },
    {
      id: 5,
      name: 'Environmental Club',
      category: 'Social',
      description: 'Make a difference! Join us in creating a sustainable campus.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      members: 167,
      president: {
        name: 'Zainab Hassan',
        avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400',
      },
      nextEvent: 'Campus Cleanup - Nov 11',
    },
    {
      id: 6,
      name: 'Robotics Team',
      category: 'Technology',
      description: 'Build, program, and compete with robots in national competitions.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
      members: 112,
      president: {
        name: 'Ali Mohammed',
        avatar: 'https://images.unsplash.com/photo-1654027879796-b9dee8caabb6?w=400',
      },
      nextEvent: 'Robot Showcase - Nov 18',
      trending: true,
    },
  ];

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myClubs = clubs.filter(club => joinedClubs.includes(club.id));
  const trendingClubs = clubs.filter(club => club.trending);

  const toggleJoin = (clubId: number) => {
    setJoinedClubs(prev =>
      prev.includes(clubId)
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };

  const { colors } = useTheme();

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <header className={`${colors.bgPrimary} px-4 py-4 border-b ${colors.border}`}>
        <h1 className={`text-xl mb-4 ${colors.textPrimary}`}>Clubs & Organizations</h1>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${colors.textSecondary}`} />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${colors.border} ${colors.bgSecondary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${colors.textPrimary}`}
          />
        </div>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <div className={`${colors.bgPrimary} border-b ${colors.border} px-4`}>
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              All Clubs
            </TabsTrigger>
            <TabsTrigger
              value="my-clubs"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              My Clubs ({myClubs.length})
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Trending
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-4">
              {filteredClubs.map((club) => (
                <Card key={club.id} className={`${colors.bgPrimary} ${colors.border} overflow-hidden hover:shadow-lg transition-shadow`}>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-white/90 text-gray-900 mb-2">
                        {club.category}
                      </Badge>
                      <h3 className="text-white">{club.name}</h3>
                    </div>
                    {club.trending && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{club.description}</p>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={club.president.avatar} />
                        <AvatarFallback>{club.president.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">President</p>
                        <p className="text-sm">{club.president.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Members</p>
                        <p className="text-sm flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {club.members}
                        </p>
                      </div>
                    </div>

                    {club.nextEvent && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 p-2 bg-blue-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>Next: {club.nextEvent}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleJoin(club.id)}
                        className={`flex-1 ${
                          joinedClubs.includes(club.id)
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {joinedClubs.includes(club.id) ? (
                          <>Joined</>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join Club
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="my-clubs" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-4">
              {myClubs.length > 0 ? (
                myClubs.map((club) => (
                  <Card key={club.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{club.name}</h3>
                          <Badge className="mb-2 text-xs" variant="outline">
                            {club.category}
                          </Badge>
                          {club.nextEvent && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {club.nextEvent}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">You haven't joined any clubs yet</p>
                  <p className="text-sm text-gray-400 mt-1">Explore clubs to get started!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-4">
              {trendingClubs.map((club) => (
                <Card key={club.id}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-white text-sm">{club.name}</h3>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {club.members} members
                      </span>
                      <Button size="sm" onClick={() => toggleJoin(club.id)}>
                        {joinedClubs.includes(club.id) ? 'Joined' : 'Join'}
                      </Button>
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