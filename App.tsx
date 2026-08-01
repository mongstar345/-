import { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toaster } from 'sonner@2.0.3';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Login } from './components/Login';
import { DEFAULT_UNIVERSITIES, type University } from './data/universities';

// Lazy load main screens
const Home = lazy(() => import('./components/Explore').then(m => ({ default: m.Explore })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Chats = lazy(() => import('./components/Chats').then(m => ({ default: m.Chats })));
const Books = lazy(() => import('./components/Books').then(m => ({ default: m.Books })));
const Courses = lazy(() => import('./components/Courses').then(m => ({ default: m.Courses })));
const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Notifications = lazy(() => import('./components/Notifications').then(m => ({ default: m.Notifications })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const Help = lazy(() => import('./components/Help').then(m => ({ default: m.Help })));
const ThemeSettings = lazy(() => import('./components/ThemeSettings').then(m => ({ default: m.ThemeSettings })));
const Clubs = lazy(() => import('./components/Clubs').then(m => ({ default: m.Clubs })));
const CampusMap = lazy(() => import('./components/CampusMap').then(m => ({ default: m.CampusMap })));
const Seminars = lazy(() => import('./components/Seminars').then(m => ({ default: m.Seminars })));
const ProfessorPortal = lazy(() => import('./components/ProfessorPortal').then(m => ({ default: m.ProfessorPortal })));
const DeanPortal = lazy(() => import('./components/DeanPortal').then(m => ({ default: m.DeanPortal })));
const DeptHeadPortal = lazy(() => import('./components/DeptHeadPortal').then(m => ({ default: m.DeptHeadPortal })));
const CouncilPortal = lazy(() => import('./components/CouncilPortal').then(m => ({ default: m.CouncilPortal })));
const SecretaryPortal = lazy(() => import('./components/SecretaryPortal').then(m => ({ default: m.SecretaryPortal })));
const AdminPortal = lazy(() => import('./components/AdminPortal').then(m => ({ default: m.AdminPortal })));
const CourseCoordPortal = lazy(() => import('./components/CourseCoordPortal').then(m => ({ default: m.CourseCoordPortal })));
const DemonstratorPortal = lazy(() => import('./components/DemonstratorPortal').then(m => ({ default: m.DemonstratorPortal })));
const PremiumPlans = lazy(() => import('./components/PremiumPlans').then(m => ({ default: m.PremiumPlans })));
const AcademicServices = lazy(() => import('./components/AcademicServices').then(m => ({ default: m.AcademicServices })));

export interface UserInfo {
  name: string;
  role: string;
  email: string;
  department: string;
  univId?: string;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('Home');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [universities, setUniversities] = useState<University[]>(DEFAULT_UNIVERSITIES);
  const { colors } = useTheme();

  const handleLogin = (userData: UserInfo) => {
    setUser(userData);
    // Route to role-specific portal on login
    if (userData.role === 'professor' || userData.role === 'asstprofessor' || userData.role === 'ta') {
      setActiveTab('professor-portal');
    } else if (userData.role === 'dean') {
      setActiveTab('dean-portal');
    } else if (userData.role === 'depthead') {
      setActiveTab('depthead-portal');
    } else if (userData.role === 'council') {
      setActiveTab('council-portal');
    } else if (userData.role === 'secretary') {
      setActiveTab('secretary-portal');
    } else if (userData.role === 'admin') {
      setActiveTab('admin-portal');
    } else if (userData.role === 'coordinator') {
      setActiveTab('coordinator-portal');
    } else if (userData.role === 'demonstrator' || userData.role === 'ta') {
      setActiveTab('demonstrator-portal');
    } else {
      setActiveTab('Home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('Home');
  };

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} universities={universities} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'Chats':
        return <Chats onChatOpen={setIsChatOpen} />;
      case 'Books':
        return <Books />;
      case 'Courses':
        return <Courses />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings onNavigateToTheme={() => setActiveTab('theme')} />;
      case 'help':
        return <Help />;
      case 'theme':
        return <ThemeSettings />;
      case 'Clubs':
        return <Clubs />;
      case 'location':
        return <CampusMap />;
      case 'seminars':
        return <Seminars />;
      case 'professor-portal':
        return <ProfessorPortal user={user} />;
      case 'dean-portal':
        return <DeanPortal user={user} />;
      case 'depthead-portal':
        return <DeptHeadPortal user={user} />;
      case 'council-portal':
        return <CouncilPortal user={user} />;
      case 'secretary-portal':
        return <SecretaryPortal user={user} />;
      case 'admin-portal':
        return <AdminPortal user={user} universities={universities} onUniversitiesChange={setUniversities} />;
      case 'coordinator-portal':
        return <CourseCoordPortal user={user} />;
      case 'demonstrator-portal':
        return <DemonstratorPortal user={user} />;
      case 'premium':
        return <PremiumPlans onNavigate={setActiveTab} />;
      case 'services':
        return <AcademicServices onNavigate={setActiveTab} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen ${colors.bgSecondary} ${!isChatOpen ? 'pb-16' : ''}`}>
      {!isChatOpen && (
        <Header
          onNavigate={(view) => setActiveTab(view)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreatePost={() => setShowCreatePost(true)}
          user={user}
          onLogout={handleLogout}
          universities={universities}
        />
      )}

      <main className="max-w-screen-xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          {renderContent()}
        </Suspense>
      </main>

      {!isChatOpen && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <Toaster position="top-center" richColors closeButton duration={3000} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
