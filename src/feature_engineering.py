def select_features(df):
    X = df[
        [
            'AMBIENT_TEMPERATURE',
            'MODULE_TEMPERATURE',
            'IRRADIATION',
            'hour',
            'day',
            'month'
        ]
    ]

    y = df['AC_POWER']

    return X, y