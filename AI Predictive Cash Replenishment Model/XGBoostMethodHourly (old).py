import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, TimeSeriesSplit, GridSearchCV, RandomizedSearchCV, cross_val_score
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error, r2_score, mean_absolute_error
import matplotlib.pyplot as plt
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor  # Import XGBoost
import os

# ---------------------------- 1. Preprocessing and Feature Engineering

# Load the dataset
# Assuming the data is in a CSV file named 'atm_data.csv'
df = pd.read_csv('atm_id1.csv')
saveFileName='xgb_model(atm2).json'

# Check the range of 'Total_Withdrawals'
min_value = df['Total_Withdrawals'].min()
max_value = df['Total_Withdrawals'].max()

print(f"Minimum Total_Withdrawals: {min_value}")
print(f"Maximum Total_Withdrawals: {max_value}")

# Convert DateTime to datetime object
df['DateTime'] = pd.to_datetime(df['DateTime'])

# Extract additional datetime features
df['Hour'] = df['DateTime'].dt.hour
df['DayOfWeek'] = df['DateTime'].dt.dayofweek  # 0: Monday, 6: Sunday
df['IsWeekend'] = df['DayOfWeek'].isin([5, 6]).astype(int)  # 1: Weekend, 0: Weekday
df['Month'] = df['DateTime'].dt.month
df['Year'] = df['DateTime'].dt.year

# Create lag features for Total_Withdrawals and Num_Withdrawals (lagging by 1 and 2 hours)
df['Total_Withdrawals_Lag_1'] = df['Total_Withdrawals'].shift(1)
df['Total_Withdrawals_Lag_2'] = df['Total_Withdrawals'].shift(2)
df['Num_Withdrawals_Lag_1'] = df['Num_Withdrawals'].shift(1)
df['Num_Withdrawals_Lag_2'] = df['Num_Withdrawals'].shift(2)

# Create rolling features (3-hour rolling mean for Total_Withdrawals and Num_Withdrawals)
df['Total_Withdrawals_Rolling_3hr'] = df['Total_Withdrawals'].rolling(window=3).mean()
df['Num_Withdrawals_Rolling_3hr'] = df['Num_Withdrawals'].rolling(window=3).mean()

# Handle missing values created by shifting and rolling (replace with forward fill or drop)
df.fillna(method='ffill', inplace=True)

# Encode categorical features
df['Location_Type'] = df['Location_Type'].astype('category').cat.codes

# Create the target variable: Forecast next hour's Total_Withdrawals
df['Target_Withdrawals'] = df['Total_Withdrawals'].shift(-1)  # Predicting next hour's withdrawal

# Drop the rows where Target_Withdrawals is NaN (since it's the last row)
df.dropna(subset=['Target_Withdrawals'], inplace=True)

# Check the preprocessed data
print(df.head())

# ---------------------------- 2. Data Splitting

# Split into training and testing datasets
train_end_date = '2024-10-11'  # Adjust this date based on your dataset
train_data = df[df['DateTime'] < train_end_date]
test_data = df[df['DateTime'] >= train_end_date]

# Separate the features (X) and the target (y) for training and testing
X_train = train_data.drop(columns=['Target_Withdrawals', 'DateTime', 'ATM_ID', 'Year'])
y_train = train_data['Target_Withdrawals']

X_test = test_data.drop(columns=['Target_Withdrawals', 'DateTime', 'ATM_ID', 'Year'])
y_test = test_data['Target_Withdrawals']

# Displaying the shapes of the training and testing datasets
print(f"Training data shape: {X_train.shape}")
print(f"Testing data shape: {X_test.shape}")

# Optionally: Check the distribution of the target variable
print(f"Target variable (training): {y_train.describe()}")
print(f"Target variable (testing): {y_test.describe()}")

# ----------------------------- 3. Model Training and Evaluation -----------------------------

# Define categorical and numerical columns
categorical_columns = ['DayOfWeek', 'Location_Type', 'isHoliday']
numerical_columns = ['Total_Withdrawals', 'Num_Withdrawals', 'ATM_Cash_Level', 'Cash_Level_Drop', 
                    'Hour', 'IsWeekend', 'Month', 'Year', 'Total_Withdrawals_Lag_1', 
                    'Total_Withdrawals_Lag_2', 'Num_Withdrawals_Lag_1', 'Num_Withdrawals_Lag_2', 
                    'Total_Withdrawals_Rolling_3hr', 'Num_Withdrawals_Rolling_3hr']

# Step 1: Preprocess the data with OneHotEncoder for categorical columns
preprocessor = ColumnTransformer(
    transformers=[('cat', OneHotEncoder(), categorical_columns)],
    remainder='passthrough'  # Keep numerical columns unchanged
)

# Apply the preprocessor to your data (train and test sets)
X_train_encoded = preprocessor.fit_transform(X_train)
X_test_encoded = preprocessor.transform(X_test)  # Apply the same transformation to the test set

# Ensure y_train is numeric (in case it's not already)
y_train = y_train.astype(float)

model_file_path = ''

# Check if the model already exists
if os.path.exists(model_file_path):
    print("Saved model found. Loading the model...")
    # Load the pre-trained model
    best_xgb_model = XGBRegressor()
    best_xgb_model.load_model(model_file_path)
    best_xgb_model.fit(X_train_encoded, y_train)

else:
    # Initialize the XGBoost model with early stopping
    # xgb_model = XGBRegressor(n_estimators=1000, random_state=42, objective='reg:squarederror', eval_metric='rmse')

    # # Define the parameter grid for RandomizedSearchCV
    # param_dist = {
    #     'learning_rate': [0.01, 0.05, 0.1, 0.2],
    #     'max_depth': [3, 4, 5, 6, 7],
    #     'subsample': [0.7, 0.8, 0.9, 1.0],
    #     'colsample_bytree': [0.7, 0.8, 0.9, 1.0],
    #     'gamma': [0, 0.1, 0.2, 0.3],
    # }

    # # Use RandomizedSearchCV with a fixed number of iterations
    # random_search = RandomizedSearchCV(
    #     estimator=xgb_model,
    #     param_distributions=param_dist,
    #     n_iter=100,  # Number of random combinations to test
    #     scoring='neg_mean_squared_error',
    #     cv=5,  # 5-fold cross-validation
    #     verbose=1,
    #     n_jobs=-1,  # Use all available cores for parallel processing
    #     random_state=42,
    #     refit='neg_mean_squared_error'  # Automatically refit on full dataset with best hyperparameters
    # )

    # # Perform the randomized search
    # random_search.fit(X_train_encoded, y_train)

    # # Print the best hyperparameters and score
    # print(f"Best hyperparameters: {random_search.best_params_}")
    # print(f"Best cross-validation score: {random_search.best_score_}")

    # # Model Evaluation on Test Set
    # # Train the XGBoost model with the best hyperparameters
    # best_xgb_model = random_search.best_estimator_
    best_xgb_model = XGBRegressor(n_estimators=500, learning_rate=0.05, max_depth=5, subsample=0.9, colsample_bytree=0.8, gamma=0.1, random_state=42)
    best_xgb_model.fit(X_train_encoded, y_train)
    # save_model = best_xgb_model.save_model(saveFileName)


# ----------------------------- Multi-step Forecasting -----------------------------
forecast_horizon = 168  # Forecasting the next 168 hours
forecasted_withdrawals = []  # To store forecasted values

# Start with the last row of the test set for recursive prediction
last_known_features = X_test.iloc[-1:].copy()

for _ in range(forecast_horizon):
    # Encode features for prediction
    last_known_features_encoded = preprocessor.transform(last_known_features)
    
    # Predict next hour's Total_Withdrawals
    next_withdrawal = best_xgb_model.predict(last_known_features_encoded)[0]
    forecasted_withdrawals.append(next_withdrawal)
    
    # Update `last_known_features` to prepare for next prediction
    # Shift the lag features to include the new prediction
    last_known_features['Total_Withdrawals_Lag_2'] = last_known_features['Total_Withdrawals_Lag_1']
    last_known_features['Total_Withdrawals_Lag_1'] = next_withdrawal
    last_known_features['Total_Withdrawals_Rolling_3hr'] = (last_known_features['Total_Withdrawals_Rolling_3hr'] * 2 + next_withdrawal) / 3
    
    # Update time-based features
    last_known_features['Hour'] = (last_known_features['Hour'] + 1) % 24
    last_known_features['DayOfWeek'] = (last_known_features['DayOfWeek'] + (last_known_features['Hour'] == 0).astype(int)) % 7
    last_known_features['IsWeekend'] = last_known_features['DayOfWeek'].isin([5, 6]).astype(int)

# ---- Accuracy Evaluation ----

# Slice the first 168 actual values (if available)
actual_withdrawals = y_test[:forecast_horizon].values

# Calculate errors between forecasted and actual withdrawals
mae = mean_absolute_error(actual_withdrawals, forecasted_withdrawals)
mse = mean_squared_error(actual_withdrawals, forecasted_withdrawals)
rmse = np.sqrt(mse)
mape = mean_absolute_percentage_error(actual_withdrawals, forecasted_withdrawals)

# Print out the evaluation metrics
print(f"Evaluation Metrics for 168-Step Forecast:")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"Mean Absolute Percentage Error (MAPE): {mape:.2f}%")

# Create a DataFrame to visualize forecast vs. actual
results_df = pd.DataFrame({
    'Hour': range(1, forecast_horizon + 1),
    'Forecasted_Withdrawal': forecasted_withdrawals,
    'Actual_Withdrawal': actual_withdrawals
})

# ----------------------------- Plotting Forecasted vs Actual Values -----------------------------
# Get actual Total_Withdrawals for the next 168 hours in the test set
actual_values = y_test.iloc[:forecast_horizon].values

# Plot actual vs forecasted values
plt.figure(figsize=(14, 7))
plt.plot(actual_values, label="Actual Total Withdrawals", color="blue", marker="o")
plt.plot(forecasted_withdrawals, label="Forecasted Total Withdrawals", color="orange", linestyle="--", marker="x")
plt.xlabel("Hour")
plt.ylabel("Total Withdrawals")
plt.title("Actual vs Forecasted Total Withdrawals for the Next 168 Hours")
plt.legend()
plt.show()

# ATM capacity and refill threshold
atm_capacity = 150000
current_atm_balance = 100000
refill_threshold = 0.05  # 10% of capacity, so alarm at balance < 15,000

# Initialize ATM balances for predicted and actual scenarios
current_atm_balance_predicted = current_atm_balance
current_atm_balance_actual = current_atm_balance

# List to store alarm information
alarm_times = []

# Loop through predictions and actual withdrawals with debugging output
for i, (predicted_withdrawal, actual_withdrawal) in enumerate(zip(forecasted_withdrawals, y_test.iloc[:forecast_horizon])):
    # Calculate predicted balance and check for alarm
    current_atm_balance_predicted -= predicted_withdrawal
    predicted_alarm_triggered = current_atm_balance_predicted < atm_capacity * refill_threshold
    if predicted_alarm_triggered:
        print(f"[PREDICTED ALARM] Hour {i+1}: Predicted balance {current_atm_balance_predicted} is below threshold.")
        current_atm_balance_predicted = atm_capacity  # Refill predicted balance

    # Calculate actual balance and check for alarm
    current_atm_balance_actual -= actual_withdrawal
    actual_alarm_triggered = current_atm_balance_actual < atm_capacity * refill_threshold
    if actual_alarm_triggered:
        print(f"[ACTUAL ALARM] Hour {i+1}: Actual balance {current_atm_balance_actual} is below threshold.")
        current_atm_balance_actual = atm_capacity  # Refill actual balance

    # Append alarm data for this timestep
    alarm_times.append({
        'DateTime': df['DateTime'].iloc[len(y_train) + i],  # Use the corresponding DateTime
        'Predicted_Withdrawal': predicted_withdrawal,
        'Predicted_Remaining_Balance': current_atm_balance_predicted,
        'Predicted_Alarm_Triggered': predicted_alarm_triggered,
        'Actual_Withdrawal': actual_withdrawal,
        'Actual_Remaining_Balance': current_atm_balance_actual,
        'Actual_Alarm_Triggered': actual_alarm_triggered
    })

# Convert alarm times to a DataFrame and save to CSV
alarm_df = pd.DataFrame(alarm_times)
alarm_df.to_csv('atm_balance_alarm_times.csv', index=False)

# Output summary of alarms for quick inspection
if not alarm_df.empty:
    triggered_alarms = alarm_df[(alarm_df['Predicted_Alarm_Triggered']) | (alarm_df['Actual_Alarm_Triggered'])]
    if not triggered_alarms.empty:
        print("Alarms triggered at the following times:\n", triggered_alarms)
    else:
        print("No alarms triggered: ATM balance did not fall below threshold.")
else:
    print("No alarms triggered.")

# # Train the model (ensure this step is done before accessing feature importances)
# # best_xgb_model.fit(X_train_encoded, y_train)

# # Now you can access the feature importances after the model is fitted
# importances = best_xgb_model.feature_importances_

# # Get the encoded feature names after OneHotEncoder
# encoded_feature_names = preprocessor.transformers_[0][1].get_feature_names_out(categorical_columns)

# # Combine encoded feature names with the numerical feature names
# numerical_feature_names = [col for col in X_train.columns if col not in categorical_columns]
# all_feature_names = list(encoded_feature_names) + numerical_feature_names

# # Ensure the length of importances matches the length of all features
# assert len(importances) == len(all_feature_names), f"Length mismatch: {len(importances)} != {len(all_feature_names)}"

# # Create a DataFrame with feature names and their importances
# feature_importance_df = pd.DataFrame({
#     'Feature': all_feature_names,
#     'Importance': importances
# })

# # Sort by importance
# feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)

# # Print the feature importances
# print(feature_importance_df)

# # Step 1: Convert the encoded NumPy arrays into DataFrames with proper column names
# encoded_feature_names = preprocessor.transformers_[0][1].get_feature_names_out(categorical_columns)
# numerical_feature_names = [col for col in X_train.columns if col not in categorical_columns]

# # Combine encoded and numerical feature names to create a full list of feature names
# all_feature_names = list(encoded_feature_names) + numerical_feature_names

# # Convert the NumPy arrays to DataFrame with the correct feature names
# X_train_encoded_df = pd.DataFrame(X_train_encoded, columns=all_feature_names)
# X_test_encoded_df = pd.DataFrame(X_test_encoded, columns=all_feature_names)

# # Step 2: Drop the features with low importance (e.g., less than 0.05)
# features_to_drop = feature_importance_df[feature_importance_df['Importance'] <= 0.05]['Feature'].tolist()

# # Drop the low-importance features from the DataFrames
# X_train_filtered = X_train_encoded_df.drop(columns=features_to_drop)
# X_test_filtered = X_test_encoded_df.drop(columns=features_to_drop)

# # Step 3: Retrain the model with the filtered features
# best_xgb_model.fit(X_train_filtered, y_train)

# # Step 4: Evaluate the model performance again
# y_pred_filtered = best_xgb_model.predict(X_test_filtered)
# mse_filtered = mean_squared_error(y_test, y_pred_filtered)
# r2_filtered = r2_score(y_test, y_pred_filtered)

# print(f"Mean Squared Error (Filtered): {mse_filtered}")
# print(f"R2 Score (Filtered): {r2_filtered}")

# # Plot Actual vs Predicted Withdrawals
# plt.figure(figsize=(10, 6))
# plt.plot(y_test.values, label='Actual Withdrawals', color='blue')
# plt.plot(y_pred_filtered, label='Predicted Withdrawals', color='red')
# plt.title("Actual vs Predicted Withdrawals (Tuned Model)")
# plt.xlabel("Time")
# plt.ylabel("Withdrawals")
# plt.legend()
# plt.show()

# Plot the feature importances
# plt.figure(figsize=(10, 6))
# plt.barh(feature_importance_df['Feature'], feature_importance_df['Importance'], color='skyblue')
# plt.xlabel('Importance')
# plt.ylabel('Feature')
# plt.title('Feature Importances')
# plt.gca().invert_yaxis()  # Reverse the y-axis to show the most important features at the top
# plt.show()
