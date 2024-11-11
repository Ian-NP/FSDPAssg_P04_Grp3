import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FreezeAccount = () => {
    const { accountNum } = useParams(); // Get accountNum from URL parameters

    useEffect(() => {
        const freezeAccount = async () => {
            console.log(`Request to freeze account: "${accountNum}"`); // Log the incoming account number

            try {
                const response = await fetch(`http://localhost:3000/api/transactions/freeze-account/${encodeURIComponent(accountNum)}`, {
                    method: 'POST', // Use POST method as defined in your API
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message); // Notify user of success
                } else {
                    const errorData = await response.json();
                    alert(errorData.message); // Notify user of error
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while freezing the account.');
            }
        };

        freezeAccount(); // Call the function to freeze the account
    }, [accountNum]); // Dependencies array ensures this runs when accountNum changes

    return <div>Freezing your account...</div>; // Display a loading message or spinner
};

export default FreezeAccount;
