# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# Load the dataset
file_path = './atm_transactions.csv'
atm_data = pd.read_csv(file_path)

# Parse the 'Transaction Date' with a flexible format
atm_data['Transaction Date'] = pd.to_datetime(atm_data['Transaction Date'], format='%d-%m-%Y', errors='coerce')

# Check for any parsing issues
if atm_data['Transaction Date'].isnull().any():
    print("Warning: Some dates could not be parsed. Check for inconsistent date formats.")

# Drop rows with parsing issues if necessary
atm_data = atm_data.dropna(subset=['Transaction Date'])

# Extract day of the week and month as features
atm_data['Day of Week'] = atm_data['Transaction Date'].dt.dayofweek
atm_data['Month'] = atm_data['Transaction Date'].dt.month

# Rename columns for uniformity
atm_data = atm_data.rename(columns={'Transaction Date': 'ds', 'Total amount Withdrawn': 'y'})

# Get unique ATM names
atms = atm_data['ATM Name'].unique()

# Select features and target
features = ['No Of Withdrawals', 'No Of XYZ Card Withdrawals', 'No Of Other Card Withdrawals',
            'Day of Week', 'Month']
target = 'y'

# Iterate over each ATM and train an XGBoost model
for atm in atms:
    print(f"\nTraining XGBoost model for ATM: {atm}")
    
    # Filter data for the current ATM
    atm_df = atm_data[atm_data['ATM Name'] == atm]
    
    if len(atm_df) < 20:  # Ensure there is enough data to train and test
        print(f"Not enough data to train a reliable model for ATM: {atm}")
        continue
    
    X = atm_df[features]
    y = atm_df[target]
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train an XGBoost Regressor
    xgb_model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    xgb_model.fit(X_train, y_train)
    
    # Predict for the test set
    y_pred = xgb_model.predict(X_test)
    
    # Calculate regression metrics
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    # Print the metrics
    print("Model Evaluation Metrics:")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"Mean Squared Error (MSE): {mse:.2f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
    print(f"R-squared (R²) Score: {r2:.2f}")
    
    # Plot the predicted vs actual values for the test set
    plt.figure(figsize=(14, 7))
    plt.plot(y_test.values, label='Actual', marker='o', linestyle='-', alpha=0.7)
    plt.plot(y_pred, label='Predicted', marker='x', linestyle='--', alpha=0.7)
    plt.title(f'Next-Day Predicted vs Actual Total Amount Withdrawn for ATM: {atm}')
    plt.xlabel('Index of Test Data')
    plt.ylabel('Total Amount Withdrawn')
    plt.legend()
    plt.show()
