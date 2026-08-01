import { Newspaper, Calendar, Clock, Bookmark, Share2, TrendingUp, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: 'academic' | 'event' | 'announcement' | 'achievement';
  image?: string;
  author: {
    name: string;
    avatar: string;
    title?: string;
  };
  date: string;
  readTime: string;
  isTrending?: boolean;
  isUrgent?: boolean;
}

function getTitleColor(title?: string): string {
  if (!title) return 'text-gray-600';
  if (title.startsWith('Prof.')) return 'text-purple-600';
  if (title.startsWith('Asstprof')) return 'text-blue-600';
  if (title.startsWith('Letr')) return 'text-teal-600';
  if (title.startsWith('T.A')) return 'text-green-600';
  return 'text-gray-600';
}

export function News() {
  const [savedNews, setSavedNews] = useState<number[]>([]);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'University Ranked Among Top 100 in Computer Science',
      excerpt: 'Al-Nahrain University has been recognized in the latest QS World Rankings for its excellence in Computer Science programs.',
      category: 'achievement',
      image: 'https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?w=600',
      author: {
        name: 'Dr. Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        title: 'Prof.',
      },
      date: '2 hours ago',
      readTime: '3 min read',
      isTrending: true,
    },
    {
      id: 2,
      title: 'Campus Safety Alert: New Security Measures',
      excerpt: 'Important updates regarding enhanced security protocols effective from next week.',
      category: 'announcement',
      author: {
        name: 'Security Department',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      },
      date: '5 hours ago',
      readTime: '2 min read',
      isUrgent: true,
    },
    {
      id: 3,
      title: 'Annual Science Fair Registration Now Open',
      excerpt: 'Students can now register their projects for the 2025 Science Fair. Exciting prizes await!',
      category: 'event',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
      author: {
        name: 'Event Committee',
        avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400',
      },
      date: '1 day ago',
      readTime: '4 min read',
      isTrending: true,
    },
    {
      id: 4,
      title: 'New Research Lab Opens for AI Studies',
      excerpt: 'State-of-the-art facilities now available for students and researchers working on AI projects.',
      category: 'academic',
      image: 'https://images.unsplash.com/photo-1707944746620-fc0371b91906?w=600',
      author: {
        name: 'Letr. Ahmed Hadi',
        avatar: 'https://images.unsplash.com/photo-1654027879796-b9dee8caabb6?w=400',
        title: 'Letr.',
      },
      date: '2 days ago',
      readTime: '5 min read',
    },
    {
      id: 5,
      title: 'Student Team Wins International Hackathon',
      excerpt: 'Our CS students secured first place in the Global Innovation Challenge with their healthcare app.',
      category: 'achievement',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      author: {
        name: 'T.A Doha Ahmed',
        avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400',
        title: 'T.A',
      },
      date: '3 days ago',
      readTime: '6 min read',
      isTrending: true,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-700';
      case 'event':
        return 'bg-purple-100 text-purple-700';
      case 'announcement':
        return 'bg-orange-100 text-orange-700';
      case 'achievement':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleSave = (newsId: number) => {
    setSavedNews(prev =>
      prev.includes(newsId)
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  const trendingNews = newsItems.filter(item => item.isTrending);
  const urgentNews = newsItems.filter(item => item.isUrgent);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          News & Updates
        </h1>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              All News
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="urgent"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Urgent
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              {newsItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.isTrending && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {item.isUrgent && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{item.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.author.avatar} />
                          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-xs">{item.author.name}</p>
                            {item.author.title && (
                              <span className={`text-xs ${getTitleColor(item.author.title)}`}>
                                {item.author.title}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSave(item.id)}
                          className={savedNews.includes(item.id) ? 'text-blue-500' : ''}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${savedNews.includes(item.id) ? 'fill-current' : ''}`}
                          />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              {trendingNews.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex gap-3 p-4">
                    {item.image && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Badge className="mb-2 text-xs bg-red-100 text-red-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                      <h3 className="text-sm mb-2">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="urgent" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              {urgentNews.length > 0 ? (
                urgentNews.map((item) => (
                  <Card key={item.id} className="border-l-4 border-orange-500">
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-orange-100 text-orange-700">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                      <h3 className="text-sm mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.excerpt}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No urgent news</p>
                  <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
