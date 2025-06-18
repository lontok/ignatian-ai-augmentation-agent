import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import SimpleLoggedIn from './pages/SimpleLoggedIn';
import ContextStage from './pages/context/ContextStage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <SimpleLoggedIn />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* IPP stage routes */}
              <Route 
                path="/context" 
                element={
                  <ProtectedRoute>
                    <ContextStage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;