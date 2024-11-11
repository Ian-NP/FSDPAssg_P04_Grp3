import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, TimeSeriesSplit, GridSearchCV, RandomizedSearchCV, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import matplotlib.pyplot as plt
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor  # Import XGBoost
import os

atm1Model = "xgb_model(atm1).json"
atm2Model = "xgb_model(atm2).json"
atm3Model = "xgb_model(atm3).json"
atm4Model = "xgb_model(atm4).json"
atm5Model = "xgb_model(atm5).json"
atm6Model = "xgb_model(atm6).json"
atm7Model = "xgb_model(atm7).json"

# Load the pre-trained model
best_xgb_model = XGBRegressor()
best_xgb_model.load_model(model_file_path)
best_xgb_model.fit(X_train_encoded, y_train)

