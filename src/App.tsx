import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import './App.css';
import { ThemeContextProvider } from './context/ThemeContextProvider';

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="DashboardUI" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/DashboardUI" replace />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;