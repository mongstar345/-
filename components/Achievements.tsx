import { Trophy, Award, Star, Medal, Target, TrendingUp, Zap, Heart, BookOpen, Users, MessageCircle, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'academic' | 'social' | 'activity' | 'special';
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface Leaderboard {
  rank: number;
  user: {
    name: string;
    avatar: string;
    title?: string;
  };
  points: number;
  achievements: number;
  isMe?: boolean;
}

export function Achievements() {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'Top Student',
      description: 'Achieve a GPA of 3.8 or higher for two consecutive semesters',
      icon: Trophy,
      category: 'academic',
      unlocked: true,
      unlockedDate: 'Oct 15, 2024',
      rarity: 'legendary',
      points: 500,
    },
    {
      id: 2,
      title: 'Course Master',
      description: 'Complete 10 courses with grade A or higher',
      icon: BookOpen,
      category: 'academic',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      rarity: 'epic',
      points: 300,
    },
    {
      id: 3,
      title: 'Social Butterfly',
      description: 'Make connections with 50 students',
      icon: Users,
      category: 'social',
      unlocked: true,
      unlockedDate: 'Sep 20, 2024',
      rarity: 'rare',
      points: 200,
    },
    {
      id: 4,
      title: 'Early Bird',
      description: 'Attend classes on time for 30 consecutive days',
      icon: Zap,
      category: 'activity',
      progress: 23,
      maxProgress: 30,
      unlocked: false,
      rarity: 'common',
      points: 100,
    },
    {
      id: 5,
      title: 'Helpful Hand',
      description: 'Help 20 classmates with their assignments',
      icon: Heart,
      category: 'social',
      unlocked: true,
      unlockedDate: 'Nov 1, 2024',
      rarity: 'rare',
      points: 200,
    },
    {
      id: 6,
      title: 'Discussion Champion',
      description: 'Post 100 comments in course discussions',
      icon: MessageCircle,
      category: 'activity',
      progress: 67,
      maxProgress: 100,
      unlocked: false,
      rarity: 'common',
      points: 150,
    },
    {
      id: 7,
      title: 'Event Enthusiast',
      description: 'Attend 15 campus events',
      icon: Calendar,
      category: 'activity',
      progress: 12,
      maxProgress: 15,
      unlocked: false,
      rarity: 'rare',
      points: 200,
    },
    {
      id: 8,
      title: 'Research Pioneer',
      description: 'Publish a research paper',
      icon: Star,
      category: 'academic',
      unlocked: true,
      unlockedDate: 'Aug 10, 2024',
      rarity: 'legendary',
      points: 500,
    },
    {
      id: 9,
      title: 'Perfect Attendance',
      description: 'No absences for an entire semester',
      icon: Medal,
      category: 'activity',
      unlocked: false,
      progress: 85,
      maxProgress: 100,
      rarity: 'epic',
      points: 300,
    },
    {
      id: 10,
      title: 'Library Regular',
      description: 'Visit the library 50 times',
      icon: BookOpen,
      category: 'activity',
      progress: 38,
      maxProgress: 50,
      unlocked: false,
      rarity: 'common',
      points: 100,
    },
  ];

  const leaderboard: Leaderboard[] = [
    {
      rank: 1,
      user: {
        name: 'Sarah Ahmed',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        title: 'St.',
      },
      points: 2450,
      achievements: 15,
    },
    {
      rank: 2,
      user: {
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        title: 'St.',
      },
      points: 2150,
      achievements: 13,
    },
    {
      rank: 3,
      user: {
        name: 'Mustafa Ahmed',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        title: 'St.',
      },
      points: 1900,
      achievements: 12,
      isMe: true,
    },
    {
      rank: 4,
      user: {
        name: 'Fatima Ali',
        avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
        title: 'St.',
      },
      points: 1750,
      achievements: 11,
    },
    {
      rank: 5,
      user: {
        name: 'Omar Khaled',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        title: 'St.',
      },
      points: 1600,
      achievements: 10,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700';
      case 'rare':
        return 'bg-blue-100 text-blue-700';
      case 'epic':
        return 'bg-purple-100 text-purple-700';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl">Achievements</h1>
              <p className="text-sm opacity-90">Track your progress</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">{unlockedAchievements.length}</p>
            <p className="text-xs opacity-90">Unlocked</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">{totalPoints}</p>
            <p className="text-xs opacity-90">Points</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">#{leaderboard.find(l => l.isMe)?.rank || '-'}</p>
            <p className="text-xs opacity-90">Rank</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="unlocked" className="w-full">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="unlocked"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Unlocked ({unlockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger
              value="locked"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Locked ({lockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Leaderboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="unlocked" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-4 space-y-4">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className="overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)}`} />
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm mb-1">{achievement.title}</h3>
                              <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                            </div>
                            <Badge className={getRarityBadgeColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                {achievement.points} pts
                              </div>
                              {achievement.unlockedDate && (
                                <span className="text-xs text-gray-500">
                                  Unlocked: {achievement.unlockedDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="locked" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-4 space-y-4">
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                const progressPercent = achievement.progress && achievement.maxProgress
                  ? (achievement.progress / achievement.maxProgress) * 100
                  : 0;

                return (
                  <Card key={achievement.id} className="overflow-hidden opacity-75">
                    <div className={`h-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)}`} />
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center flex-shrink-0 opacity-40`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-sm mb-1">{achievement.title}</h3>
                              <p className="text-xs text-gray-600 mb-3">{achievement.description}</p>
                            </div>
                            <Badge className={getRarityBadgeColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>

                          {achievement.progress !== undefined && achievement.maxProgress && (
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-blue-600">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <Progress value={progressPercent} className="h-2" />
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="h-3 w-3 text-gray-400" />
                            {achievement.points} pts
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-4 space-y-3">
              {leaderboard.map((entry) => (
                <Card key={entry.rank} className={entry.isMe ? 'border-2 border-blue-500 bg-blue-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        entry.rank === 2 ? 'bg-gray-200 text-gray-600' :
                        entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.rank <= 3 ? (
                          <Trophy className="h-5 w-5" />
                        ) : (
                          <span className="text-sm">#{entry.rank}</span>
                        )}
                      </div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.user.avatar} />
                        <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm">{entry.user.name}</h3>
                          {entry.isMe && (
                            <Badge className="bg-blue-500 text-white text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {entry.achievements} achievements
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {entry.points}
                        </p>
                        <p className="text-xs text-gray-500">points</p>
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
