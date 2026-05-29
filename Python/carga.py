import pandas as pd
import os

def cargar_datos_json(json_data):
    """Convierte datos JSON recibidos de la API en un DataFrame."""
    return pd.DataFrame(json_data)

def cargar_csv_upload(file_storage):
    """Lee un archivo CSV subido a través de Flask."""
    return pd.read_csv(file_storage)

#carga de Comercio y Categoria--------------------------------------------------------------------------------------
def cargar_comercio ():
    ruta = os.path.join('..', 'data', 'row', 'comercio.csv')
    if os.path.exists(ruta):
        df_comercioComercio=pd.read_csv(ruta)
        df_comercioComercio.info()
        return df_comercioComercio
    return pd.DataFrame()

def cargar_categoria():
    ruta = os.path.join('..', 'data', 'row', 'categoria.csv')
    if os.path.exists(ruta):
        df_categoria=pd.read_csv(ruta)
        df_categoria.info()
        return df_categoria
    return pd.DataFrame()

#carga de Gastos Sucios y Limpios--------------------------------------------------------------------------------------
def cargar_Gastos():
    ruta = os.path.join('..', 'data', 'row', 'Gastos_Sucios.csv')
    if os.path.exists(ruta):
        df_Gastos = pd.read_csv(ruta)
        df_Gastos.info()
        return df_Gastos
    return pd.DataFrame()

def Cargar_Gastos_Limpios():
    ruta = os.path.join('..', 'data', 'processed', 'Gastos_Limpios.csv')
    if os.path.exists(ruta):
        df_Gastos_Limpios = pd.read_csv(ruta)
        df_Gastos_Limpios.info()
        return df_Gastos_Limpios
    return pd.DataFrame()


#carga de Pagos Sucios y Limpios--------------------------------------------------------------------------------------
def cargar_pagos():
    ruta = os.path.join('..', 'data', 'row', 'pagos_sucios.csv')
    if os.path.exists(ruta):
        df_pagos = pd.read_csv(ruta)
        df_pagos.info()
        return df_pagos
    return pd.DataFrame()

def Cargar_Pagos_Limpios():
    ruta = os.path.join('..', 'data', 'processed', 'pagos_limpio.csv')
    if os.path.exists(ruta):
        df_pagos_limpios = pd.read_csv(ruta)
        df_pagos_limpios.info()
        return df_pagos_limpios
    return pd.DataFrame()


#carga de Usuarios Sucios y Limpios--------------------------------------------------------------------------------------
def cargar_Usuarios():
    ruta = os.path.join('..', 'data', 'row', 'Usuarios_Sucios.csv')
    if os.path.exists(ruta):
        df_Usuarios = pd.read_csv(ruta)
        df_Usuarios.info()
        return df_Usuarios
    return pd.DataFrame()

def Cargar_Usuarios_Limpios():
    ruta = os.path.join('..', 'data', 'processed', 'Usuarios_Limpios.csv')
    if os.path.exists(ruta):
        df_Usuarios_Limpios = pd.read_csv(ruta)
        df_Usuarios_Limpios.info()
        return df_Usuarios_Limpios
    return pd.DataFrame()
