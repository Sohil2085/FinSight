import { Suspense, lazy } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import { Toaster } from 'react-hot-toast'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Invoices = lazy(() => import('./pages/Invoices'))
const Expenses = lazy(() => import('./pages/Expenses'))
const Team = lazy(() => import('./pages/Team'))
const Settings = lazy(() => import('./pages/Settings'))
const AiInsight = lazy(() => import('./pages/AiInsight'))
const Invite = lazy(() => import('./pages/Invite'))

// Layout for public pages that need the top Navbar
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invite" element={<Invite />} />
        </Route>

        {/* Protected Routes with Sidebar Layout */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-insight" element={<AiInsight />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App