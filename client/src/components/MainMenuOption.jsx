import React from 'react';
import styles from '../styles/MainMenuOption.module.css'

const MainMenuOption = ({title, img}) => {
    return (
      <div className={styles.mainMenuOptionContainer}>
        <img src={img} alt={title} className="option-image" width={150}/>
        <p>{title}</p>
      </div>
    );
  };
  
  export default MainMenuOption;