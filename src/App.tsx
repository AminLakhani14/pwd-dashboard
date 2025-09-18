import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          {/* <Route path="analytics" element={<Analytics />} /> */}
        </Route>
      </Routes>
    </Router>
    </ThemeContextProvider>
  );
}

export default App;