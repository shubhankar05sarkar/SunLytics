from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import joblib

def train_models(X, y):
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    lr = LinearRegression()
    lr.fit(X_train, y_train)

    rf = RandomForestRegressor(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    random_state=42
    )
    rf.fit(X_train, y_train)

    joblib.dump(lr, "models/linear_regression.pkl")
    joblib.dump(rf, "models/random_forest.pkl")

    joblib.dump(X_test, "models/X_test.pkl")
    joblib.dump(y_test, "models/y_test.pkl")

    return lr, rf, X_test, y_test