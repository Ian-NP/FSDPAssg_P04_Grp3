import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAccountProtection = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAccountStatus = async () => {
                const response = await fetch('/api/accounts/check-status'); // Create an API endpoint to check account status
                const data = await response.json();

                if (data.status === 'frozen') {
                    alert('Your account is frozen. You are being redirected to the main page.');
                    navigate('/mainMenu'); // Redirect to main page
                }
            };

            checkAccountStatus();
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };
};

export default withAccountProtection;
