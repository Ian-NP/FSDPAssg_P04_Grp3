import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import LabelEncoder
import datetime

# Load your dataset (assuming you already have it as 'df')
df = pd.read_csv("atm_transactions.csv")

# Convert the date and time columns to datetime
df['date'] = pd.to_datetime(df['date'])
df['time'] = pd.to_datetime(df['time'])

# Feature Engineering: Extract useful features
df['hour'] = df['time'].dt.hour  # Hour of the day
df['weekday'] = df['date'].dt.weekday  # Weekday (0-6)
df['month'] = df['date'].dt.month  # Month of the year

# Handle categorical variables
label_encoders = {}
categorical_columns = ['location_type', 'holiday_sequence', 'is_holiday', 'special_event']  # example categorical columns
for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Convert 'atm_capacity' to a numeric type (if it's not already)
df['atm_capacity'] = pd.to_numeric(df['atm_capacity'], errors='coerce')

# Drop columns that are not needed for the model
df.drop(['date', 'time', 'status'], axis=1, inplace=True)

# Check if there are any missing values and handle them (e.g., drop rows with NaN values)
df.dropna(inplace=True)

# Separate features (X) and target (y)
X = df.drop('transaction_amount', axis=1)  # Use features excluding transaction amount
y = df['transaction_amount']  # Target: transaction amount

# Train-test split (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the XGBoost Regressor
model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=1000, learning_rate=0.05)

# Train the model
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"Mean Absolute Error: {mae}")
print(f"Root Mean Squared Error: {rmse}")

# Feature importance plot
xgb.plot_importance(model)
