# Import necessary libraries
from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Initialize the Flask app
app = Flask(__name__)

# Function to load the model and make a prediction
def load_model_and_predict(model_filename, input_data):
    try:
        # Load the model from the specified file
        model = joblib.load(model_filename)
        
        # Make predictions
        predictions = model.predict(input_data)
        return predictions
    
    except FileNotFoundError:
        return {'error': f"Model file {model_filename} not found."}
    except Exception as e:
        return {'error': f"An error occurred during prediction: {str(e)}"}

# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the ATM name and input data from the request
        atm_name = request.json['atm_name']
        input_data = pd.DataFrame(request.json['input_data'])
        
        # Load the model and make predictions
        model_filename = f"{atm_name}_xgboost_model.pkl"
        prediction = load_model_and_predict(model_filename, input_data)
        
        # Check if an error occurred during prediction
        if isinstance(prediction, dict) and 'error' in prediction:
            return jsonify(prediction), 404
        
        # Return the prediction as a JSON response
        return jsonify({'prediction': prediction.tolist()})
    
    except KeyError as e:
        return jsonify({'error': f"Missing key in request data: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
