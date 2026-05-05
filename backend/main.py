from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SunLytics API")

# Setup CORS securely
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
allow_origins = [FRONTEND_URL, "http://localhost:3000"]
if os.getenv("ENVIRONMENT") == "production":
    allow_origins = [FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
models = {}

@app.on_event("startup")
async def startup_event():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Use MODEL_PATH from env, or default to ml_pipeline/models
    MODELS_DIR = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "ml_pipeline", "models"))
    
    try:
        models["rf_model"] = joblib.load(os.path.join(MODELS_DIR, "random_forest.pkl"))
        models["lr_model"] = joblib.load(os.path.join(MODELS_DIR, "linear_regression.pkl"))
        models["X_test"] = joblib.load(os.path.join(MODELS_DIR, "X_test.pkl"))
        models["y_test"] = joblib.load(os.path.join(MODELS_DIR, "y_test.pkl"))
        print(f"Successfully loaded models from {MODELS_DIR}")
    except Exception as e:
        print(f"Error loading models from {MODELS_DIR}: {e}")
        models["rf_model"], models["lr_model"], models["X_test"], models["y_test"] = None, None, None, None

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
    try:
        model = models.get("rf_model") if req.model_type == "rf" else models.get("lr_model")
        if not model:
            raise ValueError(f"Model {req.model_type} is not loaded.")

        input_df = pd.DataFrame([{
            'AMBIENT_TEMPERATURE': req.ambient_temperature,
            'MODULE_TEMPERATURE': req.module_temperature,
            'IRRADIATION': req.irradiation,
            'hour': req.hour,
            'day': req.day,
            'month': req.month
        }])

        pred = model.predict(input_df)[0]

        # Generate dynamic curve data
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
    except ValueError as ve:
        raise HTTPException(status_code=500, detail={"error": str(ve)})
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Prediction failed: {str(e)}"})

@app.get("/test-data")
async def get_test_data(model_type: str = "rf"):
    try:
        if models.get("X_test") is None or models.get("y_test") is None:
            raise ValueError("Test data not loaded")
        
        model = models.get("rf_model") if model_type == "rf" else models.get("lr_model")
        if not model:
            raise ValueError("Model not loaded")
        
        sample_X = models["X_test"].sample(n=min(100, len(models["X_test"])), random_state=42)
        sample_y = models["y_test"].loc[sample_X.index]
        preds = model.predict(sample_X)
        
        scatter_data = [{"actual": round(float(a), 2), "predicted": round(float(p), 2)} for a, p in zip(sample_y, preds)]
        return {"scatter_data": scatter_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": f"Failed to get test data: {str(e)}"})


