from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import httpx
import os

app = FastAPI(title="SunLytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

try:
    rf_model = joblib.load(os.path.join(MODELS_DIR, "random_forest.pkl"))
    lr_model = joblib.load(os.path.join(MODELS_DIR, "linear_regression.pkl"))
    X_test = joblib.load(os.path.join(MODELS_DIR, "X_test.pkl"))
    y_test = joblib.load(os.path.join(MODELS_DIR, "y_test.pkl"))
except Exception as e:
    print(f"Error loading models: {e}")
    rf_model, lr_model, X_test, y_test = None, None, None, None

class PredictRequest(BaseModel):
    model_type: str = "rf"
    ambient_temperature: float
    module_temperature: float
    irradiation: float
    hour: int
    day: int
    month: int

@app.post("/predict")
async def predict(req: PredictRequest):
    if req.model_type == "rf" and rf_model is not None:
        model = rf_model
    elif req.model_type == "lr" and lr_model is not None:
        model = lr_model
    else:
        raise HTTPException(status_code=500, detail="Model not loaded or invalid model_type")

    input_df = pd.DataFrame([{
        'AMBIENT_TEMPERATURE': req.ambient_temperature,
        'MODULE_TEMPERATURE': req.module_temperature,
        'IRRADIATION': req.irradiation,
        'hour': req.hour,
        'day': req.day,
        'month': req.month
    }])

    pred = model.predict(input_df)[0]

    # Generate dynamic curve data for Irradiation vs Power
    irr_values = np.linspace(0, 1.5, 20)
    curve_data = []
    for irr in irr_values:
        temp_df = input_df.copy()
        temp_df['IRRADIATION'] = irr
        curve_pred = model.predict(temp_df)[0]
        curve_data.append({"irradiation": round(irr, 2), "power": round(curve_pred, 2)})

    return {
        "prediction": round(pred, 2),
        "curve_data": curve_data
    }

@app.get("/test-data")
async def get_test_data(model_type: str = "rf"):
    if X_test is None or y_test is None:
        raise HTTPException(status_code=500, detail="Test data not loaded")
    
    model = rf_model if model_type == "rf" else lr_model
    
    # Sample 100 points for the scatter plot
    sample_X = X_test.sample(n=min(100, len(X_test)), random_state=42)
    sample_y = y_test.loc[sample_X.index]
    preds = model.predict(sample_X)
    
    scatter_data = []
    for actual, predicted in zip(sample_y, preds):
        scatter_data.append({"actual": round(float(actual), 2), "predicted": round(float(predicted), 2)})
        
    return {"scatter_data": scatter_data}

@app.get("/weather")
async def get_weather(lat: float = 28.6139, lon: float = 77.2090):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code"
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                current = data.get("current", {})
                return {
                    "temperature": current.get("temperature_2m", 25.0),
                    "condition_code": current.get("weather_code", 0)
                }
        except Exception:
            pass
        return {"temperature": 25.0, "condition_code": 0}
