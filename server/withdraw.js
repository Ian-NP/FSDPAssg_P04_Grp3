//withdraw.js

const FREQUENCY_THRESHOLD = 3;

export const trackWithdrawalPatterns = (amount, updateUI) => {
  // Retrieve stored patterns or initialize as an empty object
  const storedData = JSON.parse(localStorage.getItem('withdrawalPatterns')) || {};

  // Retrieve the current count for the amount or initialize it as 0
  const currentAmountCount = storedData[amount] || 0;

  // Update the count for the specific amount in the stored data
  storedData[amount] = currentAmountCount + 1;

  // Update the stored patterns in localStorage
  localStorage.setItem('withdrawalPatterns', JSON.stringify(storedData));

  // Find the most frequent amount after each withdrawal
  let mostFrequent = { amount: null, count: 0 };
  for (let storedAmount in storedData) {
    if (storedData[storedAmount] > mostFrequent.count) {
      mostFrequent.amount = storedAmount;
      mostFrequent.count = storedData[storedAmount];
    }
  }

  // Check if the most frequent amount has reached the threshold
  const thresholdMet = mostFrequent.count >= FREQUENCY_THRESHOLD;

  // Only reset the count in localStorage if threshold is met
  if (thresholdMet == 3) {
    console.log(`Threshold of ${FREQUENCY_THRESHOLD} reached for amount: $${mostFrequent.amount}.`);
    
    // Reset the count in localStorage if threshold is met
    localStorage.setItem('mostFrequentAmount', JSON.stringify({ amount: mostFrequent.amount, count: 0 }));
    alert(`Threshold of ${FREQUENCY_THRESHOLD} reached for amount: $${mostFrequent.amount}.`);
  }

  else {
    return null;
  }

  // Continue showing the most frequent amount, even if threshold is not met
  updateUI(mostFrequent.amount, thresholdMet);

  console.log(`Most frequent amount: $${mostFrequent.amount} (count: ${mostFrequent.count})`);

  // Return the most frequent amount
  return mostFrequent.amount;
};

// Retrieve the most frequent amount and its count from localStorage
export const getMostFrequentAmountFromStorage = () => {
  const storedData = JSON.parse(localStorage.getItem('withdrawalPatterns')) || {};
  
  let mostFrequentAmount = null;
  let count = 0;

  // Find the most frequent amount and its count
  for (let amount in storedData) {
    if (storedData[amount] > count) {
      mostFrequentAmount = amount;
      count = storedData[amount];
    }
  }

  return { amount: mostFrequentAmount, count: count };
};
