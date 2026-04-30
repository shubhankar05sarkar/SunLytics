# Solar Power Prediction using Machine Learning

A web-based application that predicts solar power output based on environmental conditions using Machine Learning.

---

## Features

* **Accurate Prediction:** Predict solar power output (in kW) using a trained ML model.
* **Interactive Inputs:** Adjust temperature, irradiation, and time dynamically.
* **Real-Time Results:** Get instant predictions with a single click.
* **Data Visualization:** View model performance and irradiation impact through graphs.

---

## How to Use:

1. **Enter Inputs:** Provide values for:

   * Ambient Temperature
   * Module Temperature
   * Irradiation
   * Hour, Day, Month

2. **Click Predict:** Press the **Predict Power** button.

3. **View Output:**

   * Predicted power output (in kW) will be displayed.
   * Graphs will update automatically.

---

## User Interface Overview

The application consists of:

* **Input Panel:** Enter environmental parameters.
* **Prediction Output:** Displays predicted solar power.
* **Model Performance Graph:** Shows accuracy (Actual vs Predicted).
* **Dynamic Graph:** Shows how power varies with irradiation.

---

## User Interface

![Solar App UI - Inputs](https://github.com/shubhankar05sarkar/SunLytics/blob/afa21c17e158787005f8e886020fc751abe8323c/sunlytics-ui.png)<br>
*A clean and interactive interface where users input weather parameters and get real-time solar power predictions.*

<br>

![Solar App UI - Graphs](https://github.com/shubhankar05sarkar/SunLytics/blob/afa21c17e158787005f8e886020fc751abe8323c/sunlytics-graphs.png)<br>
*Visualization dashboard showing model accuracy (left) and the relationship between irradiation and power output (right).*

---

## Dataset

Dataset used: **Solar Power Generation Data (Kaggle)**

### Features:

* Ambient Temperature (°C)
* Module Temperature (°C)
* Irradiation (kW/m²)
* Date & Time

### Target:

* Power Output (kW)

---

## Machine Learning Models Used

### 1. Linear Regression

* Used as baseline model
* Simpler but less accurate

### 2. Random Forest Regressor (Final Model)

* Handles non-linear relationships
* More robust and accurate

---

## Results

| Model             | MAE       | R² Score |
| ----------------- | --------- | -------- |
| Linear Regression | ~100 kW   | ~0.81    |
| Random Forest     | ~40.57 kW | ~0.93    |

### Interpretation:

* Random Forest significantly reduces prediction error
* High R² score indicates strong model performance
* Better suited for real-world solar data

---


## Author

Created with ❤️ by **Shubhankar Sarkar**
[GitHub Profile](https://github.com/shubhankar05sarkar)
