import React, { useState, useEffect }  from 'react';
import CertificateDesigner from './components/CertificateDesigner';
import './App.css';
import './fonts.css';
function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);
  return (
    <div>
      {fontsLoaded ? (
        <CertificateDesigner />
      ) : (
        <p>Loading fonts...</p> // Optional loading message
      )}
    </div>
  );
}

export default App;






