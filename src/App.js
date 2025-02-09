import React, { useState, useEffect }  from 'react';
import CertificateDesigner from './components/CertificateDesigner';
import './App.css';
import './fonts.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/designer/:id" element={<CertificateDesigner />} />
        <Route path="/designer" element={<CertificateDesigner />} />
      </Routes>
    </Router>
  );
}

export default App;

