# Import necessary libraries
import joblib
import os
import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from sklearn.model_selection import RandomizedSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# Create a directory to save the models if it does not exist
output_dir = 'saved_models'
os.makedirs(output_dir, exist_ok=True)

# Load the dataset
file_path = './atm_transactions.csv'
atm_data = pd.read_csv(file_path)

# Parse the 'Transaction Date' with a flexible format
atm_data['Transaction Date'] = pd.to_datetime(atm_data['Transaction Date'], format='%d-%m-%Y', errors='coerce')

# Drop rows with parsing issues if necessary
atm_data = atm_data.dropna(subset=['Transaction Date'])

# Sort by date to ensure proper calculations
atm_data = atm_data.sort_values(by=['ATM Name', 'Transaction Date'])

# Replace old ATM names with new ATM names
# atm_name_replacements = {
#     "Big Street ATM": "Yishun Ring Blk 103",
#     "Mount Road ATM": "Sembawang MRT",
#     "Airport ATM": "Admiralty MRT",
#     "KK Nagar ATM": "Woodlands MRT",
#     "Christ College ATM": "Marsiling MRT"
# }

# atm_data['ATM Name'] = atm_data['ATM Name'].replace(atm_name_replacements)

# Add rolling average features
rolling_window = 7  # Set the rolling window (e.g., 7 days)
atm_data['Rolling_Avg_Total_Withdrawn'] = atm_data.groupby('ATM Name')['Total amount Withdrawn'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())
atm_data['Rolling_Avg_No_Withdrawals'] = atm_data.groupby('ATM Name')['No Of Withdrawals'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())
atm_data['Rolling_Avg_XYZ_Withdrawals'] = atm_data.groupby('ATM Name')['No Of XYZ Card Withdrawals'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())
atm_data['Rolling_Avg_Other_Withdrawals'] = atm_data.groupby('ATM Name')['No Of Other Card Withdrawals'].transform(lambda x: x.rolling(window=rolling_window, min_periods=1).mean())

# Add lag features for relevant columns
lag_days = 3  # Number of lag days
for i in range(1, lag_days + 1):
    atm_data[f'Lag_{i}_Total_Withdrawn'] = atm_data.groupby('ATM Name')['Total amount Withdrawn'].shift(i)
    atm_data[f'Lag_{i}_No_Withdrawals'] = atm_data.groupby('ATM Name')['No Of Withdrawals'].shift(i)

# Rename columns for uniformity
atm_data = atm_data.rename(columns={'Transaction Date': 'ds', 'Total amount Withdrawn': 'y'})

# Extract day of the week and month as features (after renaming)
atm_data['Day of Week'] = atm_data['ds'].dt.dayofweek
atm_data['Month'] = atm_data['ds'].dt.month

# Drop rows with NaN values created by lag features
atm_data = atm_data.dropna()

# Get unique ATM names (updated with the new names)
atms = atm_data['ATM Name'].unique()

# Update features list to include lag features and rolling averages
features = ['No Of Withdrawals', 'No Of XYZ Card Withdrawals', 'No Of Other Card Withdrawals',
            'Day of Week', 'Month', 'Rolling_Avg_Total_Withdrawn', 'Rolling_Avg_No_Withdrawals',
            'Rolling_Avg_XYZ_Withdrawals', 'Rolling_Avg_Other_Withdrawals'] + \
           [f'Lag_{i}_Total_Withdrawn' for i in range(1, lag_days + 1)] + \
           [f'Lag_{i}_No_Withdrawals' for i in range(1, lag_days + 1)]
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

# Iterate over each ATM and either train or load the existing model
for atm in atms:
    model_filename = os.path.join(output_dir, f"{atm}_xgboost_model.pkl")
    
    # Filter data for the current ATM
    atm_df = atm_data[atm_data['ATM Name'] == atm]

    if len(atm_df) < 14:  # Ensure there is enough data to train and test
        print(f"Not enough data to train or evaluate a reliable model for ATM: {atm}")
        continue

    # Check if the model already exists
    if not os.path.exists(model_filename):
        print(f"Training model for ATM: {atm}")
        
        # Use the last 7 records as the test set and the rest as the training set
        X_train = atm_df.iloc[:-7][features]
        y_train = atm_df.iloc[:-7][target]
        X_test = atm_df.iloc[-7:][features]
        y_test = atm_df.iloc[-7:][target]
        
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

        # Save the trained model to the specified directory
        best_model = randomized_search.best_estimator_  # Define best_model here
        joblib.dump(best_model, model_filename)
        print(f"Model for {atm} saved as {model_filename}")
        
        # Print the best parameters found
        print(f"Best Parameters for ATM {atm}: {randomized_search.best_params_}")
    
    else:
        print(f"Model for {atm} already exists. Loading the model...")
        # Load the trained model
        best_model = joblib.load(model_filename)  # Define best_model here as well
    
    # Use the last 7 records as the test set
    X_test = atm_df.iloc[-7:][features]
    y_test = atm_df.iloc[-7:][target]
    
    # Make predictions using the loaded or trained model
    y_pred = best_model.predict(X_test)
    
    # Calculate and print evaluation metrics
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    print("Model Evaluation Metrics:")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"Mean Squared Error (MSE): {mse:.2f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
    print(f"R-squared (R²) Score: {r2:.2f}")
    
    # Plot the predicted vs actual values for the test set with dates on the x-axis
    plt.figure(figsize=(14, 7))
    plt.plot(y_test.index, y_test.values, label='Actual', marker='o', linestyle='-', alpha=0.7)
    plt.plot(y_test.index, y_pred, label='Predicted', marker='x', linestyle='--', alpha=0.7)

    # Add the dates as x-ticks
    plt.xticks(ticks=y_test.index, labels=atm_df['ds'].iloc[-7:].dt.strftime('%Y-%m-%d'), rotation=45)

    plt.title(f'Next-Day Predicted vs Actual Total Amount Withdrawn for ATM: {atm}')
    plt.xlabel('Date')
    plt.ylabel('Total Amount Withdrawn')
    plt.legend()
    plt.tight_layout()  # Adjust layout to ensure the x-tick labels fit
    plt.show()
