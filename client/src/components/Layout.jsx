// Layout.jsx
import React from 'react';
import Header from './Header'; // Adjust the import path as needed
import '../styles/Common.css'; // Import Layout.css

const Layout = ({ children, onExit }) => {
  return (
    <div className="atm-container">
      <Header onExit={onExit} />
      {children}
    </div>
  );
};

export default Layout;
