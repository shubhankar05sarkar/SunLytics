import pandas as pd

def load_data():
    gen1 = pd.read_csv("data/plant1_gen.csv")
    weather1 = pd.read_csv("data/plant1_weather.csv")

    gen2 = pd.read_csv("data/plant2_gen.csv")
    weather2 = pd.read_csv("data/plant2_weather.csv")

    return gen1, weather1, gen2, weather2


def preprocess_data(gen, weather):
    
    gen['DATE_TIME'] = pd.to_datetime(gen['DATE_TIME'], format='mixed', dayfirst=True)
    weather['DATE_TIME'] = pd.to_datetime(weather['DATE_TIME'], format='mixed', dayfirst=True)

    gen = gen.groupby('DATE_TIME').mean(numeric_only=True).reset_index()
    weather = weather.groupby('DATE_TIME').mean(numeric_only=True).reset_index()

    gen['DATE_TIME'] = pd.to_datetime(gen['DATE_TIME'])
    weather['DATE_TIME'] = pd.to_datetime(weather['DATE_TIME'])

    df = pd.merge(gen, weather, on='DATE_TIME')

    df = df[df['IRRADIATION'] > 0]

    df['hour'] = df['DATE_TIME'].dt.hour
    df['day'] = df['DATE_TIME'].dt.day
    df['month'] = df['DATE_TIME'].dt.month

    df = df[df['AC_POWER'] < df['AC_POWER'].quantile(0.99)]
    df = df[df['AC_POWER'] > df['AC_POWER'].quantile(0.01)]

    df = df.dropna()

    return df