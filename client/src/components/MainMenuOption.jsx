import React from 'react';
import styles from '../styles/MainMenuOption.module.css';
import { useNavigate } from 'react-router-dom';

const MainMenuOption = ({ title, img, link }) => {
    const navigate = useNavigate();

    const handleClick = () => {  // Properly declare handleClick as a function
        navigate(link);
    };

    return (
        <div className={styles.mainMenuOptionContainer} onClick={handleClick}>
            <img src={img} alt={title} className="option-image" width={150} />
            <p>{title}</p>
        </div>
    );
};

export default MainMenuOption;
