# SpendSight — Control Financiero Inteligente

SpendSight es una plataforma profesional de gestión de finanzas personales que combina la robustez de un backend empresarial con la potencia del análisis de datos moderno. El sistema permite registrar, limpiar y analizar el comportamiento financiero del usuario de manera privada y eficiente.

## 🏗️ Arquitectura del Sistema

La aplicación sigue un modelo de arquitectura distribuida para garantizar la escalabilidad y especialización de tareas:

1.  **Frontend (React + Vite):** Ubicado en `SpendSight-Front`. Proporciona una interfaz moderna y fluida. Gestiona el estado visual y la personalización mediante un `ThemeContext` global (Modos: Oscuro, Claro, Océano y Esmeralda).
2.  **Backend API (Java Spring Boot):** Ubicado en `SpendSight`. Se encarga de la lógica de negocio y la persistencia de datos en una base de datos **H2**. Expone servicios RESTful para la gestión de gastos, categorías, comercios y usuarios.
3.  **Motor de Análisis (Python + Flask):** Ubicado en la carpeta `Python`. Es el "cerebro" del proyecto. Utiliza **Pandas y NumPy** para procesar los datos en memoria, calcular proyecciones, detectar anomalías y generar recomendaciones de ahorro.

## 📂 Estructura del Módulo Python

Siguiendo principios de ingeniería de software, el motor de análisis está modularizado:

-   `main.py`: Orquestador principal que levanta el servidor Flask y gestiona las peticiones del Dashboard.
-   `carga.py`: Módulo para la ingesta de datos (JSON de la API y carga de archivos CSV).
-   `limpieza.py`: Transformación y saneamiento de datos (normalización de textos, manejo de nulos y tipos de datos).
-   `analisis.py`: Lógica estadística para métricas, gráficas, tendencias y detección de gastos atípicos.

## 🚀 Funcionalidades Principales

-   **Dashboard de Control:** Visualización detallada de gastos por año y mes.
-   **Análisis Predictivo:** Proyección de gastos para el próximo mes basada en el ritmo de consumo actual.
-   **Detección de Anomalías:** Identificación automática de "outliers" o gastos inusualmente altos.
-   **Insights de Ahorro:** Recomendaciones inteligentes generadas tras el análisis de categorías.
-   **Personalización Global:** Selector de temas integrado que afecta a toda la experiencia visual.
-   **Importación Masiva:** Capacidad de procesar y limpiar extractos bancarios externos.

## 🛠️ Configuración e Instalación

### 1. Backend (Java)
-   Requiere **JDK 17** y Maven.
-   Ejecutar el proyecto Spring Boot desde su IDE preferido.
-   La base de datos H2 se reinicia con la aplicación para pruebas rápidas.

### 2. Frontend (React)
```bash
cd SpendSight-Front
npm install
npm run dev
```

### 3. Motor de Python (Análisis)
Es fundamental ejecutar el motor de Python para que las gráficas y estadísticas del Dashboard funcionen correctamente.

**Creación del entorno virtual (Windows):**
```powershell
cd Python
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

**Nota:** Asegúrese de que el servidor Flask esté corriendo en `http://localhost:5000` para una integración exitosa con el Frontend.

## 🎨 Temas Disponibles
La aplicación permite cambiar el estilo visual globalmente desde la configuración:
-   **Modo Oscuro:** Elegancia nocturna (Predeterminado).
-   **Modo Claro:** Máxima legibilidad.
-   **Océano:** Tonos azules profundos y profesionales.
-   **Esmeralda:** Un enfoque orgánico y sobrio.

---
**SpendSight** — *Tu dinero, perfectamente visible.*