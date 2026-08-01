import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { StoryViewer } from './StoryViewer';
import { AddStoryDialog } from './AddStoryDialog';
import { useTheme } from '../contexts/ThemeContext';

interface Story {
  id: number;
  name: string;
  avatar: string;
  isYours?: boolean;
  hasStory?: boolean;
  prefix?: string;
  image?: string;
  timestamp?: string;
  storyCount?: number; // Number of stories this user has
}

function getTitleColor(prefix?: string): string {
  switch (prefix) {
    case 'Prof.':
      return 'text-purple-600';
    case 'Asstprof':
    case 'Asstprof.':
      return 'text-blue-600';
    case 'Letr':
      return 'text-teal-600';
    case 'T.A':
    case 'T.A.':
      return 'text-green-600';
    case 'St.':
      return 'text-orange-600';
    default:
      return 'text-gray-900';
  }
}

// Component to create segmented story ring
function SegmentedRing({ 
  segments, 
  isViewed 
}: { 
  segments: number; 
  isViewed: boolean;
}) {
  const size = 70;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapAngle = 8; // Gap between segments in degrees (increased from 5 to 8)
  const segmentAngle = (360 - segments * gapAngle) / segments;

  return (
    <svg 
      className="absolute inset-0 w-full h-full"
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}
    >
      <defs>
        <linearGradient id={`storyGradient-${segments}-${isViewed}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {isViewed ? (
            <>
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#d1d5db" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </>
          )}
        </linearGradient>
      </defs>
      {Array.from({ length: segments }).map((_, index) => {
        const startAngle = index * (segmentAngle + gapAngle);
        const segmentLength = (segmentAngle / 360) * circumference;
        const gapLength = (gapAngle / 360) * circumference;
        const offset = -(startAngle / 360) * circumference;

        return (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#storyGradient-${segments}-${isViewed})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function Stories() {
  const [viewingStory, setViewingStory] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<number[]>([]);
  const [userStoryCount, setUserStoryCount] = useState(0); // User's story count
  const [showAddStory, setShowAddStory] = useState(false); // Show add story dialog
  const { colors } = useTheme();

  const stories: Story[] = [
    {
      id: 1,
      name: 'Your story',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      isYours: true,
      image: 'https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?w=1080',
      timestamp: '2 hours ago',
      storyCount: userStoryCount, // Dynamic based on user's posts
    },
    {
      id: 2,
      name: 'Ahmed',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      hasStory: true,
      prefix: 'Letr',
      image: 'https://images.unsplash.com/photo-1640416639872-93aabd8d91d3?w=1080',
      timestamp: '5 hours ago',
      storyCount: 6,
    },
    {
      id: 3,
      name: 'Doha',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      hasStory: true,
      prefix: 'T.A',
      image: 'https://images.unsplash.com/photo-1707944746620-fc0371b91906?w=1080',
      timestamp: '8 hours ago',
      storyCount: 10,
    },
    {
      id: 4,
      name: 'Ali',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      hasStory: true,
      prefix: 'Asstprof',
      image: 'https://images.unsplash.com/photo-1758270704025-0e1a1793e1ca?w=1080',
      timestamp: '12 hours ago',
      storyCount: 12,
    },
    {
      id: 5,
      name: 'Ahmed',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
      hasStory: true,
      prefix: 'St.',
      image: 'https://images.unsplash.com/photo-1706528010331-0f12582db334?w=1080',
      timestamp: '1 day ago',
      storyCount: 15,
    },
  ];

  const handleStoryClick = (storyId: number, isYours: boolean) => {
    if (isYours) {
      // If user has stories, show their own story
      if (userStoryCount > 0) {
        setViewingStory(1); // View your own story
        if (!viewedStories.includes(1)) {
          setViewedStories([...viewedStories, 1]);
        }
      } else {
        // No stories yet, show add dialog
        setShowAddStory(true);
      }
    } else {
      setViewingStory(storyId);
      if (!viewedStories.includes(storyId)) {
        setViewedStories([...viewedStories, storyId]);
      }
    }
  };

  const handleAddStory = () => {
    // Simulate adding a story
    setUserStoryCount(prev => prev + 1);
    setShowAddStory(false);
    // Remove from viewed list so it shows colored ring
    setViewedStories(prev => prev.filter(id => id !== 1));
  };

  const handleViewOwnStory = () => {
    setShowAddStory(false);
    setViewingStory(1); // View your own story
    // Mark as viewed
    if (!viewedStories.includes(1)) {
      setViewedStories([...viewedStories, 1]);
    }
  };

  const handleNextStory = () => {
    if (viewingStory !== null) {
      const currentIndex = stories.findIndex(s => s.id === viewingStory);
      if (currentIndex < stories.length - 1) {
        const nextStory = stories[currentIndex + 1];
        setViewingStory(nextStory.id);
        if (!viewedStories.includes(nextStory.id)) {
          setViewedStories([...viewedStories, nextStory.id]);
        }
      }
    }
  };

  const handlePrevStory = () => {
    if (viewingStory !== null) {
      const currentIndex = stories.findIndex(s => s.id === viewingStory);
      if (currentIndex > 0) {
        setViewingStory(stories[currentIndex - 1].id);
      }
    }
  };

  return (
    <>
      <div className={`${colors.bgPrimary} border-b ${colors.border} px-4 py-4`}>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(story.id, story.isYours || false)}
            >
              <div className="relative w-[70px] h-[70px]">
                {/* Segmented Ring Background */}
                {story.storyCount && story.storyCount > 1 ? (
                  <div className="absolute inset-0">
                    <SegmentedRing
                      segments={story.storyCount}
                      isViewed={viewedStories.includes(story.id)}
                    />
                  </div>
                ) : story.storyCount === 1 ? (
                  /* Single story - solid ring */
                  <div
                    className={`absolute inset-0 rounded-full ${
                      viewedStories.includes(story.id)
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-tr from-green-300 to-sky-400'
                    }`}
                  />
                ) : story.hasStory ? (
                  /* Other users with stories */
                  <div
                    className={`absolute inset-0 rounded-full ${
                      viewedStories.includes(story.id)
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-tr from-green-300 to-sky-400'
                    }`}
                  />
                ) : (
                  /* No story - gray ring */
                  <div className="absolute inset-0 rounded-full bg-gray-200" />
                )}
                
                {/* Avatar in center */}
                <div className={`absolute inset-[3px] rounded-full ${colors.bgPrimary} flex items-center justify-center`}>
                  <Avatar className={`h-16 w-16 border-[3px] ${colors.border}`}>
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Plus icon for "Your story" */}
                {story.isYours && (
                  <div className={`absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 ${colors.border} hover:bg-blue-600 transition-colors`}>
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <span className={`text-xs max-w-[70px] truncate ${colors.textPrimary}`}>
                {story.prefix && <span className={getTitleColor(story.prefix)}>{story.prefix} </span>}
                <span>{story.name}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {viewingStory !== null && (() => {
        const currentStory = stories.find(s => s.id === viewingStory);
        return (
          <StoryViewer
            stories={stories.filter(s => s.image) as any}
            currentIndex={stories.findIndex(s => s.id === viewingStory)}
            onClose={() => setViewingStory(null)}
            onNext={handleNextStory}
            onPrev={handlePrevStory}
            isOwnStory={currentStory?.isYours || false}
          />
        );
      })()}

      {/* Add Story Dialog */}
      {showAddStory && (
        <AddStoryDialog
          userStoryCount={userStoryCount}
          handleAddStory={handleAddStory}
          handleViewOwnStory={handleViewOwnStory}
          onClose={() => setShowAddStory(false)}
        />
      )}
    </>
  );
}