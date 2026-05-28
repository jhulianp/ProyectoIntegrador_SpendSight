import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from carga import cargar_datos_json, cargar_csv_upload, cargar_comercio, cargar_categoria, cargar_Gastos, cargar_Usuarios
from limpieza import limpiar_gastos_base, limpiar_csv_externo, limpiar_datos_comercio, limpiar_datos_categoria, limpiar_datos_gastos, limpiar_datos_usuarios
from analisis import generar_estadisticas_dashboard, analizar_comercio, analizar_categoria, analizar_gastos_limpios, analizar_usuarios_limpios

app = Flask(__name__)
CORS(app)

# --- ENDPOINTS PARA EL DASHBOARD (REACT) ---

@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    try:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Recibida petición de análisis: {len(request.json)} registros.")
        df = cargar_datos_json(request.json)
        if df.empty: return jsonify({"ok": False, "error": "No hay datos"})
        
        df = limpiar_gastos_base(df)
        results = generar_estadisticas_dashboard(df)
        return jsonify({"ok": True, **results})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})

@app.route('/api/clean-csv', methods=['POST'])
def clean_csv_api():
    try:
        df = cargar_csv_upload(request.files['file'])
        df = limpiar_csv_externo(df)
        return jsonify({"ok": True, "data": df.to_dict(orient='records')})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})

if __name__ == '__main__': # Asegurar que existan las carpetas de datos
    os.makedirs(os.path.join('..', 'data', 'row'), exist_ok=True) # Asegurar que existan las carpetas de datos
    os.makedirs(os.path.join('..', 'data', 'processed'), exist_ok=True) # Asegurar que existan las carpetas de datos
    
    print("\n" + "="*50) # Ejecución directa del servidor API
    print("SPENDSIGHT PYTHON ENGINE - LISTO") # Ejecución directa del servidor API
    print("="*50 + "\n") # Ejecución directa del servidor API

    print("\n" + "="*50)
    print("Servidor Flask escuchando en http://localhost:5000")
    print("="*50 + "\n")
    app.run(port=5000, debug=True)