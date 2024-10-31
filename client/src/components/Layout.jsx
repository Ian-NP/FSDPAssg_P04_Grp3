// Layout.jsx
import React from 'react';
import Header from './Header'; // Adjust the import path as needed
import styles from '../styles/Common.module.css'; // Import Layout.css

const Layout = ({ children, onExit }) => {
  return (
    <div className={styles.atm-container}>
      <Header onExit={onExit} />
      {children}
    </div>
  );
};

export default Layout;
