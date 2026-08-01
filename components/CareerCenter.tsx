import { Briefcase, MapPin, Clock, DollarSign, Building2, Search, Bookmark, Send, TrendingUp, Users, Calendar, FileText, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary?: string;
  postedDate: string;
  description: string;
  requirements: string[];
  isSaved?: boolean;
  isApplied?: boolean;
  applicants?: number;
}

interface Workshop {
  id: number;
  title: string;
  date: string;
  time: string;
  instructor: string;
  instructorAvatar: string;
  attendees: number;
  category: string;
}

export function CareerCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<number[]>([1, 3]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([2]);

  const jobs: Job[] = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'Tech Solutions Inc.',
      companyLogo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      location: 'Baghdad, Iraq',
      type: 'internship',
      salary: '$500-800/month',
      postedDate: '2 days ago',
      description: 'Join our team as a software engineering intern and work on cutting-edge projects.',
      requirements: ['CS Student', 'JavaScript/React', 'Team player'],
      isSaved: true,
      applicants: 45,
    },
    {
      id: 2,
      title: 'Data Analyst',
      company: 'Analytics Pro',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200',
      location: 'Remote',
      type: 'full-time',
      salary: '$2000-3000/month',
      postedDate: '1 week ago',
      description: 'Looking for a data analyst to help us make data-driven decisions.',
      requirements: ['Python', 'SQL', 'Statistics'],
      isApplied: true,
      applicants: 89,
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200',
      location: 'Baghdad, Iraq',
      type: 'part-time',
      salary: '$15-25/hour',
      postedDate: '3 days ago',
      description: 'Design beautiful and user-friendly interfaces for our clients.',
      requirements: ['Figma', 'Adobe XD', 'Portfolio required'],
      isSaved: true,
      applicants: 67,
    },
    {
      id: 4,
      title: 'Mobile App Developer',
      company: 'AppWorks',
      companyLogo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200',
      location: 'Hybrid',
      type: 'contract',
      salary: '$3000-4000/month',
      postedDate: '5 days ago',
      description: 'Develop mobile applications for iOS and Android platforms.',
      requirements: ['React Native', 'Flutter', '2+ years experience'],
      applicants: 34,
    },
  ];

  const workshops: Workshop[] = [
    {
      id: 1,
      title: 'Resume Writing Workshop',
      date: 'Nov 14, 2025',
      time: '3:00 PM',
      instructor: 'Career Advisor',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      attendees: 45,
      category: 'Skills',
    },
    {
      id: 2,
      title: 'Interview Preparation',
      date: 'Nov 16, 2025',
      time: '2:00 PM',
      instructor: 'Prof. Sarah Johnson',
      instructorAvatar: 'https://images.unsplash.com/photo-1601655781320-205e34c94eb1?w=400',
      attendees: 67,
      category: 'Career',
    },
    {
      id: 3,
      title: 'LinkedIn Profile Optimization',
      date: 'Nov 18, 2025',
      time: '4:00 PM',
      instructor: 'Marketing Expert',
      instructorAvatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
      attendees: 38,
      category: 'Networking',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-700';
      case 'part-time':
        return 'bg-blue-100 text-blue-700';
      case 'internship':
        return 'bg-purple-100 text-purple-700';
      case 'contract':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const savedJobsList = jobs.filter(job => savedJobs.includes(job.id));
  const appliedJobsList = jobs.filter(job => appliedJobs.includes(job.id));

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const applyToJob = (jobId: number) => {
    setAppliedJobs(prev => [...prev, jobId]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-6">
        <h1 className="text-xl mb-4 flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Career Center
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search jobs, companies, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">{jobs.length}</p>
            <p className="text-xs opacity-90">Jobs Available</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">{appliedJobs.length}</p>
            <p className="text-xs opacity-90">Applied</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">{savedJobs.length}</p>
            <p className="text-xs opacity-90">Saved</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="jobs" className="w-full">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              All Jobs
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Saved ({savedJobs.length})
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Applied ({appliedJobs.length})
            </TabsTrigger>
            <TabsTrigger
              value="workshops"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Workshops
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jobs" className="mt-0">
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="p-4 space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm mb-1">{job.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSave(job.id)}
                            className={savedJobs.includes(job.id) ? 'text-blue-500' : ''}
                          >
                            <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getTypeColor(job.type)}>
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </Badge>
                          {job.salary && (
                            <Badge variant="outline" className="text-xs">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {job.salary}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{job.description}</p>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-2">Requirements:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.requirements.map((req, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.postedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {job.applicants} applicants
                            </span>
                          </div>
                          {appliedJobs.includes(job.id) ? (
                            <Badge className="bg-green-500 text-white">
                              Applied
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => applyToJob(job.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="p-4 space-y-3">
              {savedJobsList.length > 0 ? (
                savedJobsList.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{job.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{job.company}</p>
                          <div className="flex gap-2">
                            <Badge className={getTypeColor(job.type)} >
                              {job.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.location}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No saved jobs</p>
                  <p className="text-sm text-gray-400 mt-1">Browse jobs and save your favorites</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="applied" className="mt-0">
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="p-4 space-y-3">
              {appliedJobsList.length > 0 ? (
                appliedJobsList.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm mb-1">{job.title}</h3>
                              <p className="text-xs text-gray-600 mb-2">{job.company}</p>
                              <Badge className="bg-green-500 text-white text-xs">
                                Application Sent
                              </Badge>
                            </div>
                            <Button size="sm" variant="outline">
                              Track
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Send className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No applications yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start applying to jobs to see them here</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="workshops" className="mt-0">
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="p-4 space-y-4">
              {/* Career Resources */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Career Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Resume Templates
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Mock Interviews
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Workshops */}
              <h3 className="text-sm px-1">Upcoming Workshops</h3>
              {workshops.map((workshop) => (
                <Card key={workshop.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={workshop.instructorAvatar} />
                        <AvatarFallback>{workshop.instructor[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Badge className="mb-2 text-xs bg-purple-100 text-purple-700">
                          {workshop.category}
                        </Badge>
                        <h3 className="text-sm mb-1">{workshop.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">by {workshop.instructor}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {workshop.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {workshop.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                      Register Now
                    </Button>
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
