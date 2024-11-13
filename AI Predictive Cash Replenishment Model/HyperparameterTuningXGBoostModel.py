# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
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

# Sort by date to ensure proper rolling calculations
atm_data = atm_data.sort_values(by=['ATM Name', 'Transaction Date'])

# Add rolling average features
rolling_window = 7  # Set the rolling window (e.g., 7 days)
atm_data['Rolling_Avg_Total_Withdrawn'] = atm_data.groupby('ATM Name')['Total amount Withdrawn'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())
atm_data['Rolling_Avg_No_Withdrawals'] = atm_data.groupby('ATM Name')['No Of Withdrawals'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())
atm_data['Rolling_Avg_XYZ_Withdrawals'] = atm_data.groupby('ATM Name')['No Of XYZ Card Withdrawals'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())
atm_data['Rolling_Avg_Other_Withdrawals'] = atm_data.groupby('ATM Name')['No Of Other Card Withdrawals'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())

# Rename columns for uniformity
atm_data = atm_data.rename(columns={'Transaction Date': 'ds', 'Total amount Withdrawn': 'y'})

# Extract day of the week and month as features (after renaming)
atm_data['Day of Week'] = atm_data['ds'].dt.dayofweek
atm_data['Month'] = atm_data['ds'].dt.month

# Get unique ATM names
atms = atm_data['ATM Name'].unique()

# Update features list to include rolling averages
features = ['No Of Withdrawals', 'No Of XYZ Card Withdrawals', 'No Of Other Card Withdrawals',
            'Day of Week', 'Month', 'Rolling_Avg_Total_Withdrawn', 'Rolling_Avg_No_Withdrawals',
            'Rolling_Avg_XYZ_Withdrawals', 'Rolling_Avg_Other_Withdrawals']
target = 'y'

# Define the parameter grid for XGBoost
param_grid = {
    'n_estimators': [100, 200, 300, 500],
    'learning_rate': [0.01, 0.05, 0.1, 0.2],
    'max_depth': [3, 5, 7, 10],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
    'min_child_weight': [1, 3, 5],
    'gamma': [0, 0.1, 0.3, 0.5]
}

# Iterate over each ATM and perform hyperparameter tuning
for atm in atms:
    print(f"\nHyperparameter tuning for ATM: {atm}")
    
    # Filter data for the current ATM
    atm_df = atm_data[atm_data['ATM Name'] == atm]
    
    if len(atm_df) < 20:  # Ensure there is enough data to train and test
        print(f"Not enough data to train a reliable model for ATM: {atm}")
        continue
    
    X = atm_df[features]
    y = atm_df[target]
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create an XGBoost Regressor instance
    xgb_model = XGBRegressor(random_state=42)
    
    # Set up the RandomizedSearchCV
    randomized_search = RandomizedSearchCV(
        estimator=xgb_model,
        param_distributions=param_grid,
        n_iter=50,  # Number of different combinations to try
        scoring='neg_mean_squared_error',
        cv=3,  # 3-fold cross-validation
        verbose=2,
        n_jobs=-1,  # Use all available cores
        random_state=42
    )
    
    # Fit the model with RandomizedSearchCV
    randomized_search.fit(X_train, y_train)
    
    # Print the best parameters found
    print(f"Best Parameters for ATM {atm}: {randomized_search.best_params_}")
    
    # Use the best estimator to predict
    best_model = randomized_search.best_estimator_
    y_pred = best_model.predict(X_test)
    
    # Calculate and print evaluation metrics
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    print("Model Evaluation Metrics after Hyperparameter Tuning with Rolling Averages:")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"Mean Squared Error (MSE): {mse:.2f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
    print(f"R-squared (R²) Score: {r2:.2f}")
    
    # Plot the predicted vs actual values for the test set
    plt.figure(figsize=(14, 7))
    plt.plot(y_test.values, label='Actual', marker='o', linestyle='-', alpha=0.7)
    plt.plot(y_pred, label='Predicted', marker='x', linestyle='--', alpha=0.7)
    plt.title(f'Next-Day Predicted vs Actual Total Amount Withdrawn for ATM: {atm} (After Hyperparameter Tuning with Rolling Averages)')
    plt.xlabel('Index of Test Data')
    plt.ylabel('Total Amount Withdrawn')
    plt.legend()
    plt.show()
