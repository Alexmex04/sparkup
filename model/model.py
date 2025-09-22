import numpy as np
import os
import joblib
import pandas as pd
import sys
import json

def createModel():
    from sklearn.model_selection import train_test_split
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.metrics import f1_score
    from sklearn import tree

    from imblearn.over_sampling import SMOTE
    from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
    from sklearn.metrics import accuracy_score



    df=pd.read_csv('model/company_data.csv', na_values=['?', 'None', 'nan'])
    df.isnull().sum()

        # Limpiar datos
    df = df.replace([np.inf, -np.inf], np.nan) 
    umbral = 0.5 * len(df) 
    df = df.dropna(axis=1, thresh=umbral) 
    df = df.fillna(df.median()) 
    #X1: net profit / total assets = utilidad_neta / total_activos
    #X2: total liabilities / total assets = total_pasivos / total_activos
    #X3: working capital / total assets = (activo_corriente - pasivo_corriente) / total_activos
    #X4: current assets / short-term liabilities = activo_corriente / pasivo_corriente
    #X6: retained earnings / total assets = utilidad_neta / total_activos
    #X8: book value of equity / total liabilities = patrimonio / total_pasivos
    #X9: sales / total assets = ventas_totales / total_activos
    #X10: equity / total assets = patrimonio / total_activos
    #X17: total assets / total liabilities = total_activos / total_pasivos
    #X18: gross profit / total assets = (ventas_totales - costo_ventas) / total_activos
    #X19: gross profit / sales   = (ventas_totales - costo_ventas) / ventas_totales
    #X23: net profit / sales  = utilidad_neta / ventas_totales
    #X44: (receivables * 365) / sales   =  (cuentas_por_cobrar * 365) / ventas_totales
    #X50: current assets / total liabilities = activo_corriente / total_pasivos
    #X51: short-term liabilities / total assets = pasivo_corriente / total_activos
    #X60: sales / inventory = ventas_totales / inventario_final
    #X61: sales / receivables = ventas_totales / cuentas_por_cobra
    variablex = df[["X1", "X2", "X3", "X4", "X6", "X8", "X9", "X10", "X17", "X18", "X19", "X23",  "X44", "X50", "X51", "X60", "X61"]].values
    #variablex = df[["X3", "X4", "X6", "X8", "X9", "X10", "X17", "X19", "X23", "X26", "X33", "X34", "X38", "X44", "X45", "X51", "X57"]].values
    variabley = df[["Y"]].values

    X_train, X_test, y_train, y_test = train_test_split(variablex, variabley, test_size = 0.33, random_state = 42, stratify=variabley)

    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)



    model = DecisionTreeClassifier(criterion="log_loss", random_state=42, max_depth=10, class_weight='balanced')


    model.fit(X_resampled, y_resampled)

    y_pred = model.predict(X_test)
    #y_prob = model.predict_proba(X_test)[:, 1]
    y_prob = model.predict_proba(X_test)[:, 1]

 
    joblib.dump(model, 'model/modelo_tree.pkl')


def predict(input_data):
    #model = joblib.load('model/modelo_tree.pkl')
    model_path = os.path.join(os.path.dirname(__file__), 'modelo_tree.pkl')
    model = joblib.load(model_path)
    input_array = np.array(input_data).reshape(1, -1)
    prediction = model.predict(input_array)
    prediction_proba = model.predict_proba(input_array)

    return {
        'prediction': int(prediction[0]),
        'probability_class_0': float(prediction_proba[0][0]),
        'probability_class_1': float(prediction_proba[0][1])
    }

if __name__ == "__main__":
    try:
        # Leer JSON de Node (stdin)
        data = sys.stdin.read()
        if not data:
            print(json.dumps({'error': 'No se recibieron datos'}))
            sys.exit(1)
            
        data_json = json.loads(data)
        features = data_json["features"]
        
        result = predict(features)
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {'error': f'Error general: {str(e)}'}
        print(json.dumps(error_result))
        sys.exit(1)
#createModel()
# Ejemplo de uso
#resultado = predict(-0.10537, 0.53629, -0.045578, 0.91478, -0.10537, 0.8646, 
#                   0.9504, 0.46367, 1.8647, -0.10994, -0.077072, -0.073868, 
#                   77.374, 0.91225, 0.53481, 7.7332, 4.7174)

#print(f"Predicción: {resultado['prediction']}")
#print(f"Probabilidad clase 0: {resultado['probability_class_0']:.4f}")
#print(f"Probabilidad clase 1: {resultado['probability_class_1']:.4f}")