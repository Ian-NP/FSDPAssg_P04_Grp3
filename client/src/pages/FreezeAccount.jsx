import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/FreezeAccount.css';  // Adjust the path to point to the 'styles' folder

const FreezeAccount = () => {
    const { accountNum } = useParams();
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const freezeAccount = async () => {
            console.log(`Request to freeze account: "${accountNum}"`);
            const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;

            try {
                const response = await fetch(`${baseURL}/api/transactions/freeze-account/${encodeURIComponent(accountNum)}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while freezing the account.');
            }
            setIsLoading(false); // Stop loading when done
        };

        freezeAccount();
    }, [accountNum]);

    return (
        <div className="freeze-container">
            <div className="freeze-message">
                {isLoading ? 'Freezing your account...' : 'Account frozen successfully!'}
            </div>
            {isLoading && <div className="freeze-loading"><div className="freeze-spinner"></div></div>}
        </div>
    );
};

export default FreezeAccount;
