import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import ShowSelection from './pages/ShowSelection';
import SeatSelection from './pages/SeatSelection';
import Confirmation from './pages/Confirmation';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './components/Toast';
import Admin from './pages/Admin';
import './index.css';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { userInfo } = useContext(AuthContext);
  if (!userInfo) return <Navigate to="/login" />;
  if (adminOnly && !userInfo.isAdmin) return <Navigate to="/" />;
  if (userOnly && userInfo.isAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/book/:id" element={<ShowSelection />} />
                  <Route path="/seats" element={<SeatSelection />} />
                  <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute userOnly={true}><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
