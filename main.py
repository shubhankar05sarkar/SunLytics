from src.data_preprocessing import load_data, preprocess_data
from src.feature_engineering import select_features
from src.model_training import train_models
from src.evaluate import evaluate_model
import pandas as pd
import matplotlib.pyplot as plt

def main():
    gen1, weather1, gen2, weather2 = load_data()

    df1 = preprocess_data(gen1, weather1)
    df2 = preprocess_data(gen2, weather2)

    df = pd.concat([df1, df2], ignore_index=True)

    X, y = select_features(df)

    lr, rf, X_test, y_test = train_models(X, y)

    evaluate_model(lr, X_test, y_test, "Linear Regression")
    evaluate_model(rf, X_test, y_test, "Random Forest")

    y_pred = rf.predict(X_test)

    plt.scatter(y_test, y_pred)
    plt.xlabel("Actual Power")
    plt.ylabel("Predicted Power")
    plt.title("Actual vs Predicted Power")
    plt.show()

if __name__ == "__main__":
    main()