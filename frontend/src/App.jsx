import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import CreateJob from './pages/CreateJob';
import SkillPassport from './pages/SkillPassport';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Applications from './pages/Applications';
import './App.css';

// Layout wrapper for authenticated routes
function AuthenticatedLayout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="main-content-with-sidebar">
        {children}
      </div>
    </>
  );
}

// Layout wrapper for public routes
function PublicLayout({ children }) {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        user ? <Navigate to="/jobs" replace /> :
          <PublicLayout><Landing /></PublicLayout>
      } />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* Protected Routes with Sidebar */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <JobList />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <JobDetail />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-job"
        element={
          <ProtectedRoute requireRole="employer">
            <AuthenticatedLayout>
              <CreateJob />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/skill-passport"
        element={
          <ProtectedRoute requireRole="freelancer">
            <AuthenticatedLayout>
              <SkillPassport />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Applications />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Chat />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="app">
              <AppRoutes />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
