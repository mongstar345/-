import { HelpCircle, Search, MessageCircle, Mail, Phone, BookOpen, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Guide {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: number;
}

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to Settings > Profile Settings > Change Password. You will need to enter your current password and then create a new one.',
      category: 'Account',
    },
    {
      id: 2,
      question: 'How do I join a club?',
      answer: 'Navigate to the Clubs & Organizations section from the main menu, browse available clubs, and click the "Join Club" button on any club you\'re interested in.',
      category: 'Clubs',
    },
    {
      id: 3,
      question: 'How do I register for courses?',
      answer: 'Go to the Courses section and browse available courses. Click on a course to see details and click "Enroll" to register. Make sure you meet the prerequisites.',
      category: 'Courses',
    },
    {
      id: 4,
      question: 'How do I download course materials?',
      answer: 'In the Books or Courses section, find the material you want to download and click the download icon. The file will be saved to your device.',
      category: 'Books',
    },
    {
      id: 5,
      question: 'How do I message a professor?',
      answer: 'Go to the Chats section and click the + button to start a new conversation. Search for the professor\'s name and start chatting.',
      category: 'Messages',
    },
    {
      id: 6,
      question: 'How do I turn off notifications?',
      answer: 'Go to Settings > Notifications and toggle off the types of notifications you don\'t want to receive. You can customize email, push, and in-app notifications.',
      category: 'Settings',
    },
    {
      id: 7,
      question: 'How do I apply for a job?',
      answer: 'Visit the Career Center, browse available jobs, and click "Apply Now" on any position you\'re interested in. Make sure your profile and resume are up to date.',
      category: 'Career',
    },
    {
      id: 8,
      question: 'How do I report a problem or bug?',
      answer: 'Use the "Report an Issue" button below or contact support via email. Please provide as much detail as possible including screenshots if available.',
      category: 'Support',
    },
  ];

  const guides: Guide[] = [
    {
      id: 1,
      title: 'Getting Started Guide',
      description: 'Learn the basics of Al-Nahrain Campus',
      icon: BookOpen,
      steps: 5,
    },
    {
      id: 2,
      title: 'Course Registration',
      description: 'Step-by-step course enrollment',
      icon: CheckCircle2,
      steps: 4,
    },
    {
      id: 3,
      title: 'Using the Chat System',
      description: 'Communicate with peers and faculty',
      icon: MessageCircle,
      steps: 3,
    },
    {
      id: 4,
      title: 'Privacy & Security',
      description: 'Keep your account safe',
      icon: AlertCircle,
      steps: 6,
    },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { colors } = useTheme();

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <header className={`bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-6`}>
        <h1 className="text-xl mb-2 flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          Help & Support
        </h1>
        <p className="text-sm opacity-90 mb-4">We're here to help you</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </header>

      <Tabs defaultValue="faq" className="w-full">
        <div className={`${colors.bgPrimary} border-b ${colors.border} px-4`}>
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="faq"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="guides"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Guides
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Contact Us
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="faq" className="mt-0">
          <ScrollArea className="h-[calc(100vh-260px)]">
            <div className="p-4">
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`} className={`${colors.bgPrimary} rounded-lg border ${colors.border} px-4`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-3 text-left">
                        <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <span className={`text-sm ${colors.textPrimary}`}>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-7 pt-2">
                        <p className={`text-sm ${colors.textSecondary} mb-2`}>{faq.answer}</p>
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className={`h-16 w-16 ${colors.textSecondary} mx-auto mb-3`} />
                  <p className={colors.textSecondary}>No results found</p>
                  <p className={`text-sm ${colors.textSecondary} mt-1`}>Try different keywords</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="guides" className="mt-0">
          <ScrollArea className="h-[calc(100vh-260px)]">
            <div className="p-4 space-y-3">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Card key={guide.id} className={`hover:shadow-md transition-shadow cursor-pointer ${colors.bgPrimary} ${colors.border}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-sm mb-1 ${colors.textPrimary}`}>{guide.title}</h3>
                          <p className={`text-xs ${colors.textSecondary} mb-2`}>{guide.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {guide.steps} steps
                          </Badge>
                        </div>
                        <ChevronRight className={`h-5 w-5 ${colors.textSecondary} flex-shrink-0`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="contact" className="mt-0">
          <ScrollArea className="h-[calc(100vh-260px)]">
            <div className="p-4 space-y-4">
              {/* Contact Options */}
              <Card className={`${colors.bgPrimary} ${colors.border}`}>
                <CardHeader>
                  <CardTitle className={`text-sm ${colors.textPrimary}`}>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button className={`w-full flex items-center gap-4 p-3 rounded-lg ${colors.bgHover} transition-colors`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm ${colors.textPrimary}`}>Live Chat</p>
                      <p className={`text-xs ${colors.textSecondary}`}>Chat with our support team</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${colors.textSecondary}`} />
                  </button>

                  <button className={`w-full flex items-center gap-4 p-3 rounded-lg ${colors.bgHover} transition-colors`}>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm ${colors.textPrimary}`}>Email Support</p>
                      <p className={`text-xs ${colors.textSecondary}`}>support@alnahrain.edu.iq</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${colors.textSecondary}`} />
                  </button>

                  <button className={`w-full flex items-center gap-4 p-3 rounded-lg ${colors.bgHover} transition-colors`}>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm ${colors.textPrimary}`}>Phone Support</p>
                      <p className={`text-xs ${colors.textSecondary}`}>+964 1 234 5678</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${colors.textSecondary}`} />
                  </button>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className={`${colors.bgPrimary} ${colors.border}`}>
                <CardHeader>
                  <CardTitle className={`text-sm ${colors.textPrimary}`}>Support Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={colors.textSecondary}>Sunday - Thursday</span>
                      <span className={colors.textPrimary}>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={colors.textSecondary}>Friday - Saturday</span>
                      <span className={colors.textSecondary}>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report an Issue */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Report an Issue</h3>
                      <p className="text-xs text-gray-600">
                        Found a bug or problem? Let us know so we can fix it.
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Report Issue
                  </Button>
                </CardContent>
              </Card>

              {/* Feedback */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">Send Feedback</h3>
                      <p className="text-xs text-gray-600">
                        Help us improve by sharing your thoughts and suggestions.
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Give Feedback
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}