import { Settings, Edit, Share2, MoreVertical, MapPin, Calendar, Mail, Phone, Award, BookOpen, Users, Heart, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface ProfileProps {
  onBack?: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const stats = [
    { label: 'Posts', value: 156 },
    { label: 'Followers', value: 892 },
    { label: 'Following', value: 234 },
  ];

  const achievements = [
    { id: 1, title: 'Top Student', icon: Award, color: 'text-yellow-500 bg-yellow-100' },
    { id: 2, title: 'Course Master', icon: BookOpen, color: 'text-blue-500 bg-blue-100' },
    { id: 3, title: 'Social Star', icon: Users, color: 'text-purple-500 bg-purple-100' },
    { id: 4, title: 'Active Learner', icon: Heart, color: 'text-red-500 bg-red-100' },
  ];

  const recentPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1666281269793-da06484657e8?w=400',
      likes: 45,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1762330918491-f4288a62adb8?w=400',
      likes: 67,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
      likes: 89,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1598954560332-fd896fd5f339?w=400',
      likes: 34,
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1706528010331-0f12582db334?w=400',
      likes: 56,
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1666281269793-da06484657e8?w=400',
      likes: 78,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-140px)]">
        {/* Profile Header */}
        <div className="bg-white pb-4">
          <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600" />
          <div className="px-4 -mt-16">
            <div className="flex items-end justify-between mb-4">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
                  <AvatarFallback>MU</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white hover:bg-blue-600 transition-colors">
                  <Edit className="h-3 w-3 text-white" />
                </button>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Edit Profile
              </Button>
            </div>

            <div className="mb-3">
              <h2 className="text-xl mb-1">Mustafa Ahmed</h2>
              <Badge className="bg-orange-100 text-orange-600 mb-2">St.</Badge>
              <p className="text-sm text-gray-600 mb-3">
                Computer Science Student | Al-Nahrain University | Class of 2025
              </p>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Baghdad, Iraq</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined September 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>mustafa.ahmed@alnnahrain.edu.iq</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-xl mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white mt-2 px-4 py-4">
          <h3 className="text-sm mb-3">Achievements</h3>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="text-center">
                  <div className={`w-12 h-12 rounded-full ${achievement.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-xs text-gray-600">{achievement.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="mt-2">
          <div className="bg-white border-b border-gray-200">
            <TabsList className="w-full justify-start bg-transparent h-auto p-0 px-4 gap-6">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
              >
                Courses
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
              >
                Saved
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {recentPosts.map((post) => (
                <div key={post.id} className="relative aspect-square bg-gray-200 cursor-pointer group">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="h-5 w-5 fill-current" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-0">
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">CS301 - Data Structures</h4>
                        <p className="text-xs text-gray-500">Progress: 68%</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">A</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {recentPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="relative aspect-square bg-gray-200 cursor-pointer">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

export default Profile;