from sklearn.metrics import mean_absolute_error, r2_score

def evaluate_model(model, X_test, y_test, name="Model"):
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\n{name} Performance:")
    print(f"MAE: {mae}")
    print(f"R2 Score: {r2}")