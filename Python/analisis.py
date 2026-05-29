import pandas as pd
import numpy as np
from datetime import datetime
import os
import re # Para correos en analisis_Usuarios_Limpios

def generar_estadisticas_dashboard(df):
    """Calcula todas las métricas requeridas por el Dashboard de React."""
    # 1. Gráfica de Barras Mensual
    # Usamos el año presente en los datos para el análisis, o el actual si el conjunto está vacío
    current_year = df['fecha'].dt.year.max() if not df.empty else datetime.now().year
    df_year = df[df['fecha'].dt.year == current_year]
    monthly_totals = df_year.groupby(df_year['fecha'].dt.month)['valor'].sum().reindex(range(1, 13), fill_value=0)
    
    # 2. Distribución por Categoría
    cat_totals = df.groupby('categoria')['valor'].sum().sort_values(ascending=False)
    chart_categories = [{"name": str(k), "value": float(v)} for k, v in cat_totals.items()]

    # 3. Transacciones Recientes
    recent_df = df.sort_values(by='fecha', ascending=False).head(5)
    chart_recent = recent_df.apply(lambda r: {
        "id": str(r.get('id', '')),
        "descripcion": str(r['descripcion']),
        "valor": float(r['valor']),
        "fecha": r['fecha'].strftime('%Y-%m-%d'),
        "categoria": str(r['categoria'])
    }, axis=1).tolist()

    # 4. Proyecciones y Tendencias
    total_gastado = df['valor'].sum()
    dias_rango = (df['fecha'].max() - df['fecha'].min()).days + 1
    promedio_diario = total_gastado / dias_rango if dias_rango > 0 else total_gastado
    proyeccion_mes = promedio_diario * 30
    
    tendencia = "Estable"
    if len(df) > 1:
        mid_point = df['fecha'].min() + (df['fecha'].max() - df['fecha'].min()) / 2
        reciente = df[df['fecha'] >= mid_point]['valor'].sum()
        antiguo = df[df['fecha'] < mid_point]['valor'].sum()
        if reciente > antiguo * 1.1: tendencia = "Al alza"
        elif reciente < antiguo * 0.9: tendencia = "A la baja"

    # 5. Detección de Anomalías
    anomalias = []
    if len(df) > 3:
        umbral = df['valor'].mean() + (2 * df['valor'].std())
        df_anomalias = df[df['valor'] > umbral]
        anomalias = df_anomalias.apply(lambda r: {
            "descripcion": r['descripcion'],
            "valor": float(r['valor']),
            "fecha": r['fecha'].strftime('%Y-%m-%d')
        }, axis=1).tolist()

    # 6. Recomendaciones
    recomendaciones = []
    top_cat = cat_totals.idxmax() if not cat_totals.empty else "N/A"
    if top_cat != "N/A":
        recomendaciones.append(f"Tu categoría de mayor gasto es **{top_cat}**. ¿Podrías reducir un 10% aquí?")
    if not anomalias:
        recomendaciones.append("¡Buen trabajo! No detectamos picos de gasto inusuales.")

    return {
        "charts": {
            "monthly": monthly_totals.tolist(),
            "categories": chart_categories,
            "recent": chart_recent,
            "total": float(total_gastado),
            "count": int(len(df))
        },
        "projection": {
            "dailyAverage": float(promedio_diario),
            "nextMonthProjected": float(proyeccion_mes),
            "trend": tendencia
        },
        "anomalies": anomalias,
        "recommendations": recomendaciones
    }

def exportar_reporte_csv(df, nombre_salida):
    """Guarda el DataFrame procesado en data/processed."""
    ruta = os.path.join('..', 'data', 'processed', nombre_salida)
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    df.to_csv(ruta, index=False)

# --- Nuevas funciones de análisis ---

def analizar_comercio(df_comercio):
    print("\n===== ANÁLISIS DE COMERCIO =====")
    print("Total registros:", len(df_comercio))
    if 'ciudad' in df_comercio.columns:
        print("Ciudades únicas:", df_comercio['ciudad'].nunique())
        print("Top 5 ciudades con más registros:")
        print(df_comercio['ciudad'].value_counts().head())
    if 'actividad' in df_comercio.columns:
        print("\nTop 5 actividades más frecuentes:")
        print(df_comercio['actividad'].value_counts().head())

def analizar_categoria(df_categoria):
    print("\n===== ANÁLISIS DE CATEGORÍA =====")
    print("Total categorías:", len(df_categoria))
    if 'estado' in df_categoria.columns:
        print("Estados únicos:", df_categoria['estado'].unique())
    if 'Nombre' in df_categoria.columns:
        print("\nTop 5 categorías más frecuentes:")
        print(df_categoria['Nombre'].value_counts().head())

def analizar_gastos_limpios(df_Gastos_Limpios):
    print("\n===== ANÁLISIS DE GASTOS LIMPIOS =====")

    # Análisis de Categorías
    if 'categoria' in df_Gastos_Limpios.columns:
        print("Cantidad de categorías únicas:")
        print(df_Gastos_Limpios['categoria'].nunique())
        print("Gasto por categoría:")
        print(df_Gastos_Limpios.groupby("categoria")["valor"].sum().sort_values(ascending=False))
        print("Transacciones por categoría:")
        print(df_Gastos_Limpios.groupby("categoria")["valor"].count())

    # Análisis de Valores
    if 'valor' in df_Gastos_Limpios.columns:
        print("\nAnálisis de valores:")
        print(df_Gastos_Limpios['valor'].describe())
        print("Gasto promedio:")
        print(df_Gastos_Limpios["valor"].mean())
        print("Gasto total:")
        print(df_Gastos_Limpios["valor"].sum())
        print("Máximo gasto:")
        print(df_Gastos_Limpios["valor"].max())
        print("Mínimo gasto:")
        print(df_Gastos_Limpios["valor"].min())

    # Análisis de Fechas
    if 'fecha' in df_Gastos_Limpios.columns:
        print("\nAnálisis de fechas:")
        print(df_Gastos_Limpios["fecha"].min())
        print(df_Gastos_Limpios["fecha"].max())

    # Análisis de Medios de Pago
    if 'medioPago' in df_Gastos_Limpios.columns:
        print("\nAnálisis de medios de pago:")
        print(df_Gastos_Limpios["medioPago"].value_counts())

    # Análisis de Comercios
    if 'comercio' in df_Gastos_Limpios.columns:
        print("\nAnálisis de comercios:")
        print(df_Gastos_Limpios["comercio"].value_counts())

    # Análisis de Estados
    if 'estado' in df_Gastos_Limpios.columns:
        print("\nAnálisis de estados:")
        print(df_Gastos_Limpios["estado"].value_counts())

    # Análisis de Notas
    if 'notas' in df_Gastos_Limpios.columns:
        print("\nAnálisis de notas:")
        print(df_Gastos_Limpios["notas"].value_counts())

def analizar_pagos_limpios(df_pagos):
    print("\n" + "=" * 50)
    print("===== ANALISIS DE PAGOS LIMPIOS =====")
    print("=" * 50)

    total = len(df_pagos)
    print(f"\nTotal registros: {total}")
    if total == 0:
        print("No hay pagos para analizar.")
        return

    if 'estado' in df_pagos.columns:
        print("\nDistribucion por estado:")
        print(df_pagos['estado'].value_counts())

    if 'metodo_pago' in df_pagos.columns:
        print("\nDistribucion por metodo de pago:")
        print(df_pagos['metodo_pago'].value_counts())

    if 'monto' in df_pagos.columns:
        print(f"\nMonto total: ${df_pagos['monto'].sum():,.2f}")
        print(f"Monto promedio: ${df_pagos['monto'].mean():,.2f}")
        print(f"Monto maximo: ${df_pagos['monto'].max():,.2f}")
        print(f"Monto minimo: ${df_pagos['monto'].min():,.2f}")

    if 'producto' in df_pagos.columns:
        print("\nTop 5 productos mas frecuentes:")
        print(df_pagos['producto'].value_counts().head())

    if 'metodo_pago' in df_pagos.columns and 'monto' in df_pagos.columns:
        print("\nMonto total y promedio por metodo de pago:")
        agrupacion = df_pagos.groupby('metodo_pago').agg({
            'monto': ['sum', 'mean', 'count']
        }).round(2)
        agrupacion.columns = ['Monto Total', 'Monto Promedio', 'Cantidad']
        print(agrupacion.to_string())

        pagos_altos = df_pagos[df_pagos['monto'] > 5000]
        print(f"\nPagos con monto mayor a $5,000: {len(pagos_altos)}")
        print(f"Monto total de pagos altos: ${pagos_altos['monto'].sum():,.2f}")

def generar_estadisticas_pagos_dashboard(df_pagos):
    """Calcula metricas de pagos listas para consumir desde React o Flask."""
    df_pagos = df_pagos.copy()
    if df_pagos.empty:
        return {
            "charts": {
                "paymentMethods": [],
                "status": [],
                "monthly": [],
                "topProducts": [],
                "total": 0.0,
                "count": 0
            },
            "summary": {
                "average": 0.0,
                "max": 0.0,
                "min": 0.0,
                "highPayments": 0
            }
        }

    if 'fecha' in df_pagos.columns:
        df_pagos['fecha'] = pd.to_datetime(df_pagos['fecha'], errors='coerce')
    else:
        df_pagos['fecha'] = pd.NaT

    if 'monto' in df_pagos.columns:
        df_pagos['monto'] = pd.to_numeric(df_pagos['monto'], errors='coerce').fillna(0)
    else:
        df_pagos['monto'] = 0

    metodos = (
        df_pagos.groupby('metodo_pago')['monto'].sum().sort_values(ascending=False)
        if 'metodo_pago' in df_pagos.columns else pd.Series(dtype=float)
    )
    estados = (
        df_pagos['estado'].value_counts()
        if 'estado' in df_pagos.columns else pd.Series(dtype=int)
    )
    productos = (
        df_pagos['producto'].value_counts().head(5)
        if 'producto' in df_pagos.columns else pd.Series(dtype=int)
    )

    df_fechas = df_pagos.dropna(subset=['fecha'])
    if not df_fechas.empty:
        current_year = df_fechas['fecha'].dt.year.max()
        df_year = df_fechas[df_fechas['fecha'].dt.year == current_year]
        monthly = (
            df_year
            .groupby(df_year['fecha'].dt.month)['monto']
            .sum()
            .reindex(range(1, 13), fill_value=0)
            .tolist()
        )
    else:
        monthly = [0] * 12

    return {
        "charts": {
            "paymentMethods": [{"name": str(k), "value": float(v)} for k, v in metodos.items()],
            "status": [{"name": str(k), "value": int(v)} for k, v in estados.items()],
            "monthly": [float(v) for v in monthly],
            "topProducts": [{"name": str(k), "value": int(v)} for k, v in productos.items()],
            "total": float(df_pagos['monto'].sum()),
            "count": int(len(df_pagos))
        },
        "summary": {
            "average": float(df_pagos['monto'].mean()),
            "max": float(df_pagos['monto'].max()),
            "min": float(df_pagos['monto'].min()),
            "highPayments": int((df_pagos['monto'] > 5000).sum())
        }
    }

def analizar_usuarios_limpios(df_Usuarios_Limpios):
    print("\n" + "=" * 55)
    print("  ANÁLISIS DE DATOS DE LA ENTIDAD USUARIOS")
    print("=" * 55)

    total = len(df_Usuarios_Limpios)
    if total == 0:
        print("No hay usuarios para analizar.")
        return

    # ── ¿Cuál ciudad tiene mayor cantidad de usuarios registrados? ───────────────────────
    if 'ciudad' in df_Usuarios_Limpios.columns:
        print("\n" + "─" * 55)
        print("Frecuencia por Ciudad")
        print("─" * 55 + "\n")
        conteo_ciudades = df_Usuarios_Limpios['ciudad'].value_counts().sort_values(ascending=False)
        if not conteo_ciudades.empty:
            ciudad_top      = conteo_ciudades.index[0]
            cantidad_top    = conteo_ciudades.iloc[0]
            print(f"  Ciudad con más usuarios: '{ciudad_top}' con {cantidad_top} usuarios\n")
            print("  Distribución completa:")
            for ciudad, cantidad in conteo_ciudades.items():
                print(f"    {ciudad:<20} - {cantidad} usuario(s)")
        print(f"\n  Ciudades únicas: {df_Usuarios_Limpios['ciudad'].nunique()}")

    # ── ¿Cuál es la edad promedio por ciudad? ────────────────────
    if 'edad' in df_Usuarios_Limpios.columns and 'ciudad' in df_Usuarios_Limpios.columns:
        print("\n" + "─" * 55)
        print("Edad Promedio por Ciudad")
        print("─" * 55 + "\n")
        edad_promedio = (
            df_Usuarios_Limpios.groupby('ciudad')['edad']
            .mean()
            .round(1)
            .sort_values(ascending=False)
        )
        for ciudad, promedio in edad_promedio.items():
            print(f"    {ciudad:<20} - {promedio} años")
        print(f"\n  Edad promedio global : {round(df_Usuarios_Limpios['edad'].mean(), 1)} años")
        print(f"  Edad máxima          : {df_Usuarios_Limpios['edad'].max()} años")
        print(f"  Edad mínima          : {df_Usuarios_Limpios['edad'].min()} años")

    # ── ¿Cuántos usuarios están en estado activo? ───────────────────
    if 'estado' in df_Usuarios_Limpios.columns:
        print("\n" + "─" * 55)
        print("Usuarios en Estado Activo")
        print("─" * 55 + "\n")
        conteo_estados   = df_Usuarios_Limpios['estado'].value_counts()
        activos          = conteo_estados.get('Activo', 0)
        inactivos        = conteo_estados.get('Inactivo', 0)
        otros            = total - activos - inactivos
        print(f"  Activos   : {activos}")
        print(f"  Inactivos : {inactivos}")
        print(f"  Otros     : {otros}")
        print(f"  Total       : {total}")

    # ── "¿Cuántos usuarios son mayores de 18 años? ──────────────────────
    if 'edad' in df_Usuarios_Limpios.columns:
        print("\n" + "─" * 55)
        print("Usuarios Mayores de 18 Años")
        print("─" * 55 + "\n")
        mayores_18 = df_Usuarios_Limpios[df_Usuarios_Limpios['edad'] > 18]
        pct        = round(mayores_18.shape[0] / total * 100, 1) if total > 0 else 0
        print(f"  Usuarios mayores de 18 años : {mayores_18.shape[0]}")
        print(f"  Porcentaje sobre el total   : {pct}%")

    # ── "¿Cuántos correos fueron corregidos durante la limpieza? ────────
    if 'correo' in df_Usuarios_Limpios.columns:
        print("\n" + "─" * 55)
        print("Calidad de Datos: Correos Corregidos")
        print("─" * 55 + "\n")
        correos_corregidos  = df_Usuarios_Limpios['correo'].str.contains('@corregido.com', na=False).sum()
        correos_validos     = df_Usuarios_Limpios['correo'].str.contains(r'@\w+\.\w+', regex=True, na=False).sum()
        print(f"  Correos marcados como '@corregido.com' : {correos_corregidos}")
        print(f"  Correos con formato válido final       : {correos_validos}")

    # ── Tipos de Documento y País ────────────────────────
    if 'tipoDocumento' in df_Usuarios_Limpios.columns and 'pais' in df_Usuarios_Limpios.columns:
        print("\n" + "─" * 55)
        print("Tipos de Documento y País")
        print("─" * 55 + "\n")
        print("\n  Distribución por tipo de documento:")
        for tipo, cant in df_Usuarios_Limpios['tipoDocumento'].value_counts().items():
            print(f"    {tipo:<10} - {cant} usuario(s)")
        print("\n  Distribución por país:")
        for pais, cant in df_Usuarios_Limpios['pais'].value_counts().items():
            print(f"    {pais:<20} - {cant} usuario(s)")
