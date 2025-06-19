import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import SimpleLoggedIn from './pages/SimpleLoggedIn';
import ContextStage from './pages/context/ContextStage';
import ExperienceStage from './pages/experience/ExperienceStage';
import ReflectionStage from './pages/reflection/ReflectionStage';
import ActionStage from './pages/action/ActionStage';
import EvaluationStage from './pages/evaluation/EvaluationStage';
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
              <Route 
                path="/experience" 
                element={
                  <ProtectedRoute>
                    <ExperienceStage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reflection" 
                element={
                  <ProtectedRoute>
                    <ReflectionStage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/action" 
                element={
                  <ProtectedRoute>
                    <ActionStage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/evaluation" 
                element={
                  <ProtectedRoute>
                    <EvaluationStage />
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