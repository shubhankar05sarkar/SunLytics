# SunLytics: Intelligent Solar Power Forecasting ☀️⚡

SunLytics is a production-grade, full-stack Machine Learning application designed to predict and analyze solar power generation in real-time. By utilizing environmental and temporal data, SunLytics provides highly accurate forecasts of active power output, allowing solar plant operators to optimize grid management and efficiency.

## 🏗️ System Architecture

The project is decoupled into three primary layers:

1. **Machine Learning Pipeline (`/src` & `/ml_pipeline`)**
   - **Models**: Includes trained `Random Forest` and `Linear Regression` models.
   - **Features**: Processes features like Ambient Temperature, Module Temperature, Solar Irradiation, and Temporal data (Hour, Day, Month).
   - **Storage**: Pre-trained pipelines are saved as `.pkl` objects using `joblib`.

2. **Backend API (`/backend`)**
   - **Framework**: FastAPI for blazing-fast, asynchronous request handling.
   - **Features**: 
     - Loads ML models securely into memory on startup.
     - Exposes `/predict` endpoint to process live parameter inputs and return power predictions.
     - Dynamically computes "Impact Curves" by sweeping irradiation values across the model.

3. **Frontend Dashboard (`/frontend`)**
   - **Framework**: Next.js 15 (React) with App Router.
   - **Styling**: Tailwind CSS v4 with a custom, highly polished **Glassmorphism** UI.
   - **Visualizations**: `recharts` for dynamic data rendering.
   - **Theming**: Complete Dark/Light/System theme toggling via `next-themes`.

---

## 📊 Domain Concepts & Visualizations

To fully understand the dashboard, it is important to grasp the underlying solar energy concepts that power the predictions:

### 1. What is Irradiation (kW/m²)?
**Irradiation** (specifically Solar Irradiance) is the measure of solar power (sunlight) hitting a specific area over a given time. In this application, it is measured in kilowatts per square meter (kW/m²). 
- **Why it matters**: It is the single most critical factor in solar power generation. If there is no irradiation (e.g., at night or under heavy cloud cover), the solar panels cannot generate power, regardless of the temperature.

### 2. The Impact Curve (Line Chart)
The **Impact Curve** is a dynamic simulation. When you hit "Generate Prediction", the backend freezes your current temperature and time parameters, and sweeps the *Irradiation* value from `0.0` to `1.2`. 
- **What it shows**: It visualizes exactly how your solar panels will perform under changing sunlight conditions at this exact moment in time. You will typically see a steep linear climb (as sunlight increases, power increases) that eventually plateaus or drops if the panels reach maximum capacity or overheat.

### 3. Actual vs Predicted (Scatter Plot)
The **Validation Scatter Plot** shows the historical performance of the currently selected machine learning model.
- **What it shows**: It plots the *Actual* historical power output (X-axis) against what the model *Predicted* the output would be (Y-axis). 
- **How to read it**: In a perfect model, every dot would fall exactly on a perfectly straight 45-degree diagonal line. The tighter the dots cluster around the invisible diagonal line, the higher the accuracy of the model!

---

## 🚀 How to Run the Application

You need to start both the FastAPI backend and the Next.js frontend simultaneously.

### 1. Start the Backend
Open a terminal and navigate to the backend directory:
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*The API will be live at `http://localhost:8000`.*

### 2. Start the Frontend
Open a **new** terminal window and navigate to the frontend directory:
```powershell
cd frontend
npm install
npm run dev
```
*The Dashboard will be live at `http://localhost:3000`.*

---

## 🛠️ Tech Stack
- **ML**: Python, Pandas, Scikit-Learn, Joblib
- **Backend**: FastAPI, Uvicorn, Pydantic
- **Frontend**: Next.js, React, Tailwind CSS, Recharts, Framer Motion, Lucide Icons
