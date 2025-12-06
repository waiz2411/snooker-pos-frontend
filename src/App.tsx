import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClubProvider } from './context/ClubContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ClubLogin from './components/club/ClubLogin';
import ClubDashboard from './components/club/ClubDashboard';

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <ClubProvider>
        <Router>
          <div className="min-h-screen bg-[#0a0a0a]">

            <Routes>
              {/* HOME REDIRECT */}
              <Route
                path="/"
                element={
                  token
                    ? <Navigate to="/club" replace />
                    : <Navigate to="/club/login" replace />
                }
              />

              {/* ADMIN ROUTES */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminDashboard />} />

              {/* CLUB ROUTES */}
              <Route path="/club/login" element={<ClubLogin />} />
              <Route path="/club/*" element={<ClubDashboard />} />
            </Routes>

          </div>
        </Router>
      </ClubProvider>
    </AuthProvider>
  );
}
