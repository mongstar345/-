# Al-Nahrain Campus - Features Documentation

## Homepage Features

### 1. Header
- Sticky navigation with menu button
- Create content dropdown (Post, Reel, Story, Go Live)
- Notifications bell with badge counter
- User profile avatar

### 2. Create Post Section
- Quick post composer with avatar
- Full modal dialog for creating posts
- Media upload options (Images, Videos, Emojis)
- Public/Private visibility settings

### 3. Stories
- Horizontal scrollable story carousel
- Gradient rings (light green to sky blue) for unviewed stories
- Gray rings for viewed stories
- Color-coded title prefixes by role:
  - Prof. (Purple)
  - Asstprof. (Blue)
  - Letr. (Teal)
  - T.A. (Green)
  - St. (Orange)
- Add story button for user
- Full-screen story viewer with:
  - Auto-progress bars
  - Swipe/tap navigation
  - Reply and reaction options
  - Timestamp display

### 4. Posts Feed
Three types of posts supported:

#### Live Stream Posts
- LIVE badge on profile picture
- Stream title and presenter info card
- Member count with "Join" button
- Live chat toggle button
- Real-time chat input
- Stream status messages

#### Regular Posts
- Text content with optional images
- Author information with role badges
- Timestamp
- Like counter with animation
- Interactive buttons:
  - Like (heart) - toggleable with counter
  - Comment - opens comment section
  - Share - opens share dialog
  - Save (bookmark) - toggleable
- More options menu (Save, Hide, Report, Copy Link)
- Full comments section with:
  - View all comments
  - Add new comments
  - Like comments
  - Reply to comments
  - Nested comment threads
  - Role-based author colors

#### Reel Posts
- Vertical video format (9:16)
- Play/pause overlay
- Mute/unmute toggle
- View count display
- Caption overlay at bottom
- Like, comment, and share interactions
- Like and comment counters

### 5. Share Functionality
- Share to Chat
- Share to Facebook
- Share via Email
- Copy link with toast notification

## Dashboard Features

### 1. Header Section
- Welcome message in Arabic
- User profile avatar
- Menu button

### 2. Filter Tabs
- All Tasks (with count)
- Pending (Pen icon)
- Completed (Shield icon)
- Personal (User icon)
- Active state highlighting
- Real-time filtering

### 3. Search & Filter
- Live search bar
- Advanced filter dialog with:
  - Category filters (Homework, Lecture, Workshop, Event, Exam)
  - Priority filters (High, Medium, Low)
  - Date filters (Today, Tomorrow, This Week, This Month)
  - Reset and Apply buttons
- Filter button in search bar

### 4. Task Cards
Four gradient color schemes:
- Yellow (Homework/Assignments)
- Blue (Lectures)
- Green (Workshops)
- Purple (Projects)

Each card includes:
- Book icon with background pattern
- Task title and subtitle (in Arabic)
- Date and time information
- Instructor avatar with border
- Role-based instructor label colors
- Interactive action buttons:
  - Bell (Notifications)
  - Calendar (Add to calendar)
  - Check (Mark complete with toast)
  - Pin (Pin task with toast)
- Completed state with reduced opacity
- Pinned state visual feedback

### 5. Empty States
- No tasks found message
- Helpful search adjustment text

## Bottom Navigation

### 5 Main Tabs:
1. **Home** - Social feed with posts, stories, reels
2. **Dashboard** - Task management and scheduling
3. **Chats** - Direct messaging (Coming soon)
4. **Books** - Course materials and library (Coming soon)
5. **Courses** - Class enrollment and content (Coming soon)

### Features:
- Active tab highlighting (blue background)
- Icon and label for each tab
- Smooth transitions
- Fixed position at bottom
- Responsive to screen size

## Global Features

### Role-Based Color System
Consistent throughout the app:
- **Prof.** - Purple (#9333EA)
- **Asstprof.** - Blue (#2563EB)
- **Letr.** - Teal (#0D9488)
- **T.A** - Green (#16A34A)
- **St.** - Orange (#EA580C)

### Interactions
- Like/Unlike with animation
- Save/Unsave posts
- Comment and reply system
- Share functionality
- Pin/Unpin tasks
- Complete/Incomplete tasks
- Story progression
- Real-time counters

### Toast Notifications
- Success messages
- Action confirmations
- Link copy confirmations
- Task status updates

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly buttons
- Scrollable containers
- Fixed header and bottom nav

### UI/UX Polish
- Smooth transitions
- Hover states on all interactive elements
- Loading states
- Empty states
- Error handling
- Skeleton screens
- Badge indicators
- Gradient backgrounds
- Backdrop blur effects
- Shadow depth

## Technical Implementation

### Components Created
1. Header.tsx
2. Stories.tsx
3. StoryViewer.tsx
4. CreatePostButton.tsx
5. PostCard.tsx
6. ReelCard.tsx
7. CommentsSection.tsx
8. ShareDialog.tsx
9. Dashboard.tsx
10. TaskCard.tsx
11. FilterDialog.tsx
12. BottomNav.tsx

### State Management
- Local state for UI interactions
- Real-time filtering
- Comment management
- Task completion tracking
- Story view tracking
- Like/bookmark persistence

### Data Structure
- Posts with type discrimination (live/regular/reel)
- Tasks with categories and priorities
- Comments with nested replies
- Stories with view tracking
- User roles and permissions

## Chats Screen ✅

### 1. Chat List View
- Search conversations with live filtering
- Online status indicators (green dot)
- Unread message badges with count
- Last message preview
- Typing indicators
- Role-based user titles with colors
- Timestamp for each conversation
- New chat button

### 2. Chat Conversation View
- Full-screen message interface
- Back button to conversation list
- User info header with online status
- Call and video call buttons
- Message bubbles (sent/received)
- Message status indicators (sent ✓, delivered ✓, read ✓✓)
- Timestamp for each message
- Message input with emoji picker
- Voice message button
- Attachment button
- Send button (appears when typing)

## Books Screen ✅

### 1. Library View
- Search by book title, author, or course
- Filter button for advanced options
- Tabs: All Books, Reading, Textbooks, Notes
- Book categories (textbook, reference, research, notes)

### 2. Book Cards
- Book cover thumbnails
- Title and author with role badges
- Associated course information
- Star ratings and download count
- Page count and file size
- Reading progress bar with percentage
- Read/Continue and Download buttons
- Upload date and file format info

### 3. Reading Progress
- Separate "Reading" tab for books in progress
- Visual progress bars
- Quick continue reading access
- Empty state for no books in progress

## Courses Screen ✅

### 1. Courses List View
- Search by course code, title, or instructor
- Tabs: Active, Completed, All Courses
- Course counts per tab

### 2. Course Cards
- Course thumbnail with gradient overlay
- Course code badge
- Next class date and time
- Progress bar with percentage
- Completed/Total lectures count
- Current grade badge
- Instructor info with role badge
- Student enrollment count
- Credits and category badges

### 3. Course Detail View
- Course header with thumbnail
- Instructor information
- Progress statistics (completion %, lectures, grade)
- Course content list with:
  - Video lectures
  - Documents
  - Quizzes
  - Assignments
- Lecture status (completed, in-progress, locked)
- Duration for each item
- Type icons for different content
- Completion checkmarks

## Profile Screen ✅

### 1. Profile Header
- Cover photo with gradient
- Large profile picture with edit button
- Edit Profile button
- Share and Settings buttons
- Back button for navigation
- User name and role badge
- Bio/description

### 2. User Information
- Location
- Join date
- Email address
- Contact information

### 3. Statistics
- Posts count
- Followers count
- Following count

### 4. Achievements Section
- Achievement badges with icons
- Color-coded achievement types
- Achievement titles

### 5. Content Tabs
- **Posts Tab**: Grid view of user's posts with like counts
- **Courses Tab**: List of enrolled courses with grades
- **Saved Tab**: Saved posts grid
- Hover effects on post thumbnails

## Notifications Screen ✅

### 1. Notification Types
- **Likes**: Heart icon, red color
- **Comments**: Message icon, blue color
- **Follows**: UserPlus icon, green color
- **Announcements**: Bell icon, purple color
- **Reminders**: Calendar icon, orange color
- **Achievements**: Award icon, yellow color

### 2. Notification Features
- Tabs: All, Unread, Today
- Notification count badges
- Mark all as read button
- Unread indicator (blue dot)
- User avatars with action icons
- Role-based user titles with colors
- Timestamp for each notification
- Post thumbnails for relevant notifications
- Follow back buttons for new followers
- Unread notification highlighting (blue background)

### 3. Empty States
- "All caught up" message for no unread notifications
- Checkmark icon for empty state

## Navigation System ✅

### Bottom Navigation (5 Tabs)
1. **Home** - Social feed
2. **Dashboard** - Task management
3. **Chats** - Direct messaging
4. **Books** - Course materials
5. **Courses** - Class content

### Header Navigation
- **Bell Icon** → Notifications screen
- **Profile Avatar** → Profile screen
- **Create Menu** → Post/Reel/Story/Live options

### Back Navigation
- Back buttons on Profile and Notifications screens
- Return to main app view
- Conditional bottom nav display

## Additional Features ✅

### State Management
- Multi-screen navigation
- View state management (main/profile/notifications)
- Tab persistence
- Back navigation handling

### UI/UX Enhancements
- Smooth transitions between screens
- Consistent header patterns
- Role-based color coding across all screens
- Empty states for all data views
- Loading and error states
- Responsive layouts
- Touch-friendly interactions

## Technical Implementation Update

### New Components
13. Chats.tsx - Full chat interface with list and conversation views
14. Books.tsx - Library with book cards and progress tracking
15. Courses.tsx - Course management with detailed view
16. Profile.tsx - User profile with tabs and achievements
17. Notifications.tsx - Comprehensive notification center

### Enhanced Navigation
- Header component with navigation callbacks
- App.tsx with multi-view state management
- Conditional bottom nav rendering
- Back button integration

### Data Structures
- Chat conversations with online status
- Books with reading progress
- Courses with lecture content
- Notifications with multiple types
- User profile with achievements

## Events Screen ✅

### 1. Events Management
- **Tabs**: Upcoming, My Events, Calendar, Past
- Event categories (academic, social, sports, cultural, career)
- Event cards with cover images and details
- Registration system with attendee tracking
- Save/bookmark events
- Share functionality
- Reminder/notification options

### 2. Event Details
- Date, time, and location
- Organizer information with role badges
- Attendee count and capacity
- Online/offline badges
- Requirements and description
- Registration status (Registered/Apply Now)
- Past event tracking

### 3. Calendar View
- Interactive calendar component
- Date selection
- Events list for selected date
- Visual event indicators

## Campus Map Screen ✅

### 1. Interactive Map
- Visual map placeholder with markers
- "Open Full Map" button
- Animated location markers
- Campus locations categorized

### 2. Location Categories
- **Buildings**: Academic buildings
- **Facilities**: Library, student center, sports complex
- **Dining**: Cafeterias and coffee shops
- **Services**: Medical center, shuttle stops
- **Parking**: Parking lots with capacity

### 3. Location Details
- Name and description
- GPS coordinates
- Contact information (phone)
- Operating hours
- Amenities list
- Category badges
- "Get Directions" button
- Location images

### 4. Search & Filter
- Search by location name
- Filter by category tabs
- Quick access to popular locations

## Achievements Screen ✅

### 1. Achievement System
- **Rarity Levels**: Common, Rare, Epic, Legendary
- Color-coded by rarity
- Point system
- Unlock dates for completed achievements
- Progress tracking for locked achievements

### 2. Achievement Types
- **Academic**: Top Student, Course Master, Research Pioneer
- **Social**: Social Butterfly, Helpful Hand
- **Activity**: Early Bird, Discussion Champion, Event Enthusiast
- **Special**: Perfect Attendance, Library Regular

### 3. User Stats
- Total unlocked achievements
- Total points earned
- Current leaderboard rank
- Visual progress indicators

### 4. Leaderboard
- Top 5 ranked users
- User avatars and names
- Points and achievement counts
- Special highlighting for current user
- Trophy icons for top 3 positions

### 5. Progress Tracking
- Visual progress bars for locked achievements
- Step-by-step completion tracking
- Remaining tasks display
- Percentage completion

## Career Center Screen ✅

### 1. Job Listings
- Job search with filters
- Company logos and branding
- Job types (Full-time, Part-time, Internship, Contract)
- Salary information
- Location (Remote, On-site, Hybrid)
- Applicant count
- Posted date

### 2. Job Details
- Full job description
- Requirements list
- Company information
- Apply functionality
- Save jobs feature
- Share job postings
- Application tracking

### 3. Application Management
- **Tabs**: All Jobs, Saved, Applied, Workshops
- Saved jobs list
- Application status tracking
- Applied jobs history

### 4. Career Workshops
- Resume writing workshops
- Interview preparation
- LinkedIn optimization
- Career advisor sessions
- Workshop registration
- Attendee counts
- Date and time scheduling

### 5. Career Resources
- Resume templates
- Mock interview services
- Quick stats (Jobs Available, Applied, Saved)

## Settings Screen ✅

### 1. Profile Settings
- Edit profile
- Change password
- Account management
- Profile picture and email display

### 2. Notifications
- Enable/disable notifications toggle
- Email notifications
- Push notifications
- Notification preferences

### 3. Privacy & Security
- Online status visibility
- Read receipts toggle
- Privacy settings access
- Blocked users management
- Two-factor authentication

### 4. Appearance
- Dark mode toggle
- Theme color selection
- Font size adjustments
- Sun/Moon icons for theme

### 5. Sound & Accessibility
- Sound effects toggle
- Accessibility options

### 6. Language & Region
- Language selection (English)
- Time zone settings (GMT+3)

### 7. Data & Storage
- Storage usage display (245 MB)
- Clear cache option
- Download user data

### 8. About Section
- App version (1.0.0)
- Terms of Service
- Privacy Policy
- Licenses

### 9. Account Actions
- Log out button
- Delete account option

## Help & Support Screen ✅

### 1. FAQ Section
- Searchable FAQ database
- Categorized questions (Account, Clubs, Courses, Books, Messages, Settings, Career, Support)
- Expandable accordion interface
- Category badges
- 8+ common questions covered

### 2. Help Guides
- Getting Started Guide (5 steps)
- Course Registration Guide (4 steps)
- Chat System Guide (3 steps)
- Privacy & Security Guide (6 steps)
- Step counter for each guide
- Icon-based visual indicators

### 3. Contact Support
- **Live Chat**: Direct support messaging
- **Email Support**: support@alnahrain.edu.iq
- **Phone Support**: +964 1 234 5678
- Support hours display
  - Sunday-Thursday: 8:00 AM - 6:00 PM
  - Friday-Saturday: Closed

### 4. Feedback System
- Report an Issue button
- Send Feedback option
- Bug reporting with details
- Suggestion submission

## Side Menu ✅

### 1. Beautiful Gradient Design
- **Gradient Background**: Green → Teal → Sky Blue
- Matches story ring gradient theme
- Smooth slide-in animation from left
- Semi-transparent overlay
- White text for contrast

### 2. Menu Structure
- **Profile Section**: Avatar, name, role badge
- **Main Navigation**: Home, Dashboard, Courses, Library, Messages (with badge)
- **Campus Section**: Clubs, News, Events, Campus Map, Achievements, Career Center
- **System Section**: Settings, Help & Support, Logout
- **Footer**: App version and copyright

### 3. Navigation Features
- Active tab highlighting with backdrop
- Badge counters for unread messages
- Smooth animations
- Click to navigate
- Auto-close on selection
- Close button (X)
- Scrollable menu content

### 4. Visual Design
- Icon for each menu item
- Separated sections with dividers
- Hover effects
- Active state with white/transparent background
- Section headers (Campus)

## Complete Feature Summary

### Total Screens: 17 ✅
1. Home Feed
2. Dashboard
3. Chats
4. Books
5. Courses
6. Clubs
7. News
8. Events ⭐ NEW
9. Campus Map ⭐ NEW
10. Achievements ⭐ NEW
11. Career Center ⭐ NEW
12. Settings ⭐ NEW
13. Help & Support ⭐ NEW
14. Profile
15. Notifications
16. Story Viewer
17. Side Menu ⭐ NEW

### Total Components: 30+ ✅

### Features Implemented:
✅ Complete social media functionality
✅ Task management system
✅ Messaging and chat
✅ Course and book management
✅ Event registration and calendar
✅ Campus navigation and maps
✅ Achievement and gamification system
✅ Job listings and career services
✅ Comprehensive settings
✅ Help and support center
✅ User profiles and notifications
✅ Beautiful gradient side menu
✅ Role-based color system
✅ Search and filtering throughout
✅ Progress tracking everywhere
✅ Responsive mobile-first design

## Next Steps (Optional Enhancements)
1. Backend integration with real database
2. Real-time updates with WebSocket
3. Push notifications service
4. Dark mode full implementation
5. Offline mode with caching
6. File upload and management
7. Video player for lectures
8. PDF reader for books
9. Advanced analytics dashboard
10. Multi-language support
