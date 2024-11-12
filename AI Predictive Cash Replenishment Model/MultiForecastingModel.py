import numpy as np
import pandas as pd
from pywt import wavedec
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import MinMaxScaler

# Load the dataset
file_path = './atm_transactions.csv'  # Replace './atm_transactions.csv' with the actual path
atm_data = pd.read_csv(file_path)

# Preprocess the data
atm_data['Transaction Date'] = pd.to_datetime(atm_data['Transaction Date'], errors='coerce')
atm_grouped = atm_data.groupby(['ATM Name', 'Transaction Date'])['Total amount Withdrawn'].sum().reset_index()

# Normalize the 'Total amount Withdrawn' column
scaler = MinMaxScaler()
atm_grouped['Total amount Withdrawn'] = scaler.fit_transform(atm_grouped[['Total amount Withdrawn']])

# Add time-based features
atm_grouped['Day of Week'] = atm_grouped['Transaction Date'].dt.dayofweek
atm_grouped['Month'] = atm_grouped['Transaction Date'].dt.month

# Feature engineering for clustering (you can extend this to add holiday data if available)
atm_features = atm_grouped.groupby('ATM Name')['Total amount Withdrawn'].agg(['mean', 'std']).reset_index()

# Prepare wavelet data function
def prepare_wavelet_data(atm_grouped, cluster_info, cluster_id):
    atm_names = cluster_info[cluster_info['Cluster'] == cluster_id]['ATM Name']
    cluster_data = atm_grouped[atm_grouped['ATM Name'].isin(atm_names)]
    
    time_series_data = []
    for atm in atm_names:
        atm_series = cluster_data[cluster_data['ATM Name'] == atm]['Total amount Withdrawn'].values
        if len(atm_series) >= 14:
            time_series_data.append(atm_series)
    
    decomposed_data = [wavedec(series, 'db1', level=2) for series in time_series_data]
    
    train_data = [data[:len(data)//2] for data in decomposed_data]
    test_data = [data[len(data)//2:] for data in decomposed_data]
    
    return train_data, test_data

# Clustering setup (example: set all to one cluster for now)
atm_features['Cluster'] = 1

# Extract train and test data for Cluster 1
train_data_cluster1, test_data_cluster1 = prepare_wavelet_data(atm_grouped, atm_features, cluster_id=1)

# Find the maximum length of the decomposed wavelet series
max_length = max([len(np.concatenate(series)) for series in train_data_cluster1])

# Pad or truncate each series to ensure uniform length
X_train = np.array([np.pad(np.concatenate(series), (0, max_length - len(np.concatenate(series))), 'constant')
                    if len(np.concatenate(series)) < max_length else np.concatenate(series)[:max_length]
                    for series in train_data_cluster1])

# Extract y_train as the last 7 days of each decomposed series in the training data
y_train = np.array([series[-1] if len(series[-1]) == 7 else np.array(series[-1][-7:])
                    for series in train_data_cluster1])
y_train = np.array([np.array(y).flatten() for y in y_train])

# Prepare the test data similarly
X_test = np.array([np.pad(np.concatenate(series), (0, max_length - len(np.concatenate(series))), 'constant')
                   if len(np.concatenate(series)) < max_length else np.concatenate(series)[:max_length]
                   for series in test_data_cluster1])

# Prepare the test targets similarly
y_test = np.array([series[-1] if len(series[-1]) == 7 else np.array(series[-1][-7:])
                   for series in test_data_cluster1])
y_test = np.array([np.array(y).flatten() for y in y_test])

# Build and compile the model
def build_wnn(input_shape):
    model = keras.Sequential([
        layers.InputLayer(input_shape=input_shape),
        layers.Dense(128, activation='relu'),
        layers.Dense(64, activation='relu'),
        layers.Dense(7)  # Output layer for 7-day forecasting
    ])
    model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='mean_squared_error')
    return model

# Create and train the model
wnn_model = build_wnn(input_shape=(X_train.shape[1],))
history = wnn_model.fit(X_train, y_train, epochs=100, batch_size=8, verbose=1)

# Plot training loss
# plt.figure(figsize=(10, 6))
# plt.plot(history.history['loss'], label='Training Loss')
# plt.title('Training Loss Over Epochs')
# plt.xlabel('Epochs')
# plt.ylabel('Loss')
# plt.legend()
# plt.show()

# Evaluate the model and get predictions
y_pred = wnn_model.predict(X_test)

# Inverse transform the normalized predicted and actual test values to their original scale
y_pred_actual = scaler.inverse_transform(y_pred)
y_test_actual = scaler.inverse_transform(y_test)

# Plot each prediction vs. actuals separately for each sample in the test set
for i in range(len(y_test_actual)):
    plt.figure(figsize=(10, 5))
    plt.plot(y_test_actual[i], label='Actual', marker='o')
    plt.plot(y_pred_actual[i], label='Predicted', linestyle='--', marker='x')
    plt.title(f'Sample {i+1} - Predicted vs. Actual Withdrawals (Original Scale)')
    plt.xlabel('Days')
    plt.ylabel('Withdrawal Amount')
    plt.legend()
    plt.show()

# Calculate evaluation metrics on the original scale
mse = mean_squared_error(y_test_actual, y_pred_actual)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test_actual, y_pred_actual)

# Calculate Mean Absolute Percentage Error (MAPE) on original scale
# Avoid division by zero by adding a small epsilon value
epsilon = 1e-6
mape = np.mean(np.abs((y_test_actual - y_pred_actual) / (y_test_actual + epsilon))) * 100

# Print the evaluation metrics
print(f'Mean Absolute Percentage Error (MAPE): {mape:.2f}%')
print(f'Mean Squared Error (MSE): {mse:.2f}')
print(f'Root Mean Squared Error (RMSE): {rmse:.2f}')
print(f'Mean Absolute Error (MAE): {mae:.2f}')
