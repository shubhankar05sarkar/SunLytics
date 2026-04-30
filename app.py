import streamlit as st
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

st.set_page_config(page_title="Solar Predictor", page_icon="☀️", layout="centered")

model = joblib.load("models/random_forest.pkl")

X_test = joblib.load("models/X_test.pkl")
y_test = joblib.load("models/y_test.pkl")

if "prediction" not in st.session_state:
    st.session_state.prediction = None

st.title("Solar Power Prediction App")
st.write("Enter weather details to predict solar power output")

def sync_slider_text(slider_key, text_key):
    st.session_state[slider_key] = st.session_state[text_key]

def sync_text_slider(slider_key, text_key):
    st.session_state[text_key] = st.session_state[slider_key]

def synced_input(label, key, min_val, max_val, default):
    if key not in st.session_state:
        st.session_state[key] = default
        st.session_state[f"{key}_text"] = default

    col1, col2 = st.columns([3, 1])

    with col1:
        st.slider(
            label,
            min_val,
            max_val,
            key=key,
            on_change=sync_text_slider,
            args=(key, f"{key}_text")
        )

    with col2:
        st.number_input(
            " ",
            min_value=min_val,
            max_value=max_val,
            key=f"{key}_text",
            on_change=sync_slider_text,
            args=(key, f"{key}_text")
        )

    return st.session_state[key]

ambient_temp = synced_input("Ambient Temperature (°C)", "ambient", 0, 50, 25)
module_temp = synced_input("Module Temperature (°C)", "module", 0, 80, 30)
irradiation = synced_input("Irradiation (kW/m²)", "irr", 0.0, 1.5, 0.5)
hour = synced_input("Hour of the Day", "hour", 0, 23, 12)
day = synced_input("Day", "day", 1, 31, 15)
month = synced_input("Month", "month", 1, 12, 6)

if hour < 6 or hour > 18:
    st.warning("Low sunlight hours → Power output may be low")

if st.button("Predict Power"):
    input_data = pd.DataFrame([{
        'AMBIENT_TEMPERATURE': ambient_temp,
        'MODULE_TEMPERATURE': module_temp,
        'IRRADIATION': irradiation,
        'hour': hour,
        'day': day,
        'month': month
    }])

    st.session_state.prediction = model.predict(input_data)[0]

prediction = st.session_state.get("prediction", None)

if prediction is not None:
    st.success(f"Predicted Power Output: {prediction:.2f} kW")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### Model Performance")

    y_pred = model.predict(X_test)

    fig, ax = plt.subplots()

    ax.scatter(y_test, y_pred, label="Predicted vs Actual")

    ax.plot(
        [y_test.min(), y_test.max()],
        [y_test.min(), y_test.max()],
        'r',
        label="Perfect Prediction"
    )

    ax.set_xlabel("Actual Power (kW)")
    ax.set_ylabel("Predicted Power (kW)")
    ax.set_title("Actual vs Predicted")

    ax.legend()

    st.pyplot(fig)

with col2:
    st.markdown("### Prediction vs Irradiation")

    irr_values = np.linspace(0, 1.5, 100)
    predictions = []

    for irr in irr_values:
        temp_df = pd.DataFrame([{
            'AMBIENT_TEMPERATURE': ambient_temp,
            'MODULE_TEMPERATURE': module_temp,
            'IRRADIATION': irr,
            'hour': hour,
            'day': day,
            'month': month
        }])

        pred = model.predict(temp_df)[0]
        predictions.append(pred)

    fig2, ax2 = plt.subplots()

    ax2.plot(irr_values, predictions, label="Prediction Curve")

    if prediction is not None:
        ax2.scatter(
            irradiation,
            prediction,
            color='red',
            s=100,
            label="Your Input"
        )

    ax2.set_xlabel("Irradiation (kW/m²)")
    ax2.set_ylabel("Predicted Power (kW)")
    ax2.set_title("Effect of Irradiation")

    ax2.legend()

    st.pyplot(fig2)