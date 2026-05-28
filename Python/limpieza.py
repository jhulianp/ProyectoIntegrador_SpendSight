import pandas as pd
import os

def limpiar_gastos_base(df):
    """Limpieza básica de tipos de datos para el historial de gastos."""
    df = df.copy()
    df['valor'] = pd.to_numeric(df['valor'], errors='coerce').fillna(0)
    df['fecha'] = pd.to_datetime(df['fecha'], errors='coerce')
    df = df.dropna(subset=['fecha']) # Eliminar registros sin fecha válida
    
    if 'categoria' in df.columns:
        df['categoria'] = df['categoria'].replace(['', None], 'Sin categoría').fillna('Sin categoría')
    else:
        df['categoria'] = 'Sin categoría'
    
    return df

# Función de limpieza para Comercio Sucio--------------------------------------------------------------------------------------
def limpiar_datos_comercio(df_comercioComercio):
    print("Limpiando datos de Comercio...")

    # Limpieza de columnas de texto
    # Convertir a string y limpiar espacios, luego estandarizar a título
    for col in ['id', 'nit', 'id_cliente', 'nombre', 'direccion', 'actividad', 'contacto', 'ciudad', 'pais']:
        if col in df_comercioComercio.columns:
            df_comercioComercio[col] = df_comercioComercio[col].astype(str).str.strip().str.title()
    
    # Teléfono solo limpiar espacios
    if 'telefono' in df_comercioComercio.columns:
        df_comercioComercio['telefono'] = df_comercioComercio['telefono'].astype(str).str.strip()

    print('Eliminando datos duplicados')
    df_comercioComercio = df_comercioComercio.drop_duplicates()

    # Validaciones
    ciudades_Validas = [
        "Medellin","Bogotá","Cali","Cartagena","Barranquilla","Santa Marta",
        "Cúcuta","Villavicencio","Pereira","Popayán","Tunja","Sincelejo",
        "Montería","Riohacha","Valledupar","Pasto","Quibdó","Leticia",
        "Florencia","San Andrés","Neiva"
    ]

    tiendas_validas = [
        "Supermercado Exito","Alkosto","Tiendas Olímpica","Postobon","Bavaria",
        "Almacen La 14","Supertiendas Cañaveral","Almacen Metro","Almacen Carulla",
        "Almacen D1","Almacen Justo&Bueno","Almacen Ara","Makro"
    ]
    
    # Asegurarse de que las columnas existan antes de aplicar la máscara
    if 'ciudad' in df_comercioComercio.columns and 'nombre' in df_comercioComercio.columns:
        mascara_ciudad = df_comercioComercio['ciudad'].isin(ciudades_Validas)
        mascara_tienda = df_comercioComercio['nombre'].isin(tiendas_validas)
        erroresDetectados = df_comercioComercio[~(mascara_ciudad & mascara_tienda)]

        if not erroresDetectados.empty:
            print("Registros de Comercio con errores detectados (ciudad o nombre no válidos):")
            print(erroresDetectados)
        else:
            print("No se detectaron errores de ciudad o nombre en Comercio.")
    else:
        print("Columnas 'ciudad' o 'nombre' no encontradas en el DataFrame de Comercio para validación.")


    # Reemplazos y nulos
    if 'pais' in df_comercioComercio.columns:
        df_comercioComercio['pais'] = df_comercioComercio['pais'].replace({'Colómbia':'Colombia', 'Pais ':'Colombia', 'Pais A':'Colombia'}) # Consolidar correcciones de país
    
    # Rellenar nulos con valores predeterminados
    df_comercioComercio['id']        = df_comercioComercio['id'].fillna("0")
    df_comercioComercio['nit']       = df_comercioComercio['nit'].fillna("000000000")
    df_comercioComercio['nombre']    = df_comercioComercio['nombre'].fillna("Desconocido")
    df_comercioComercio['actividad'] = df_comercioComercio['actividad'].fillna("No Definida")
    df_comercioComercio['contacto']  = df_comercioComercio['contacto'].fillna("Sin Contacto")
    df_comercioComercio['telefono']  = df_comercioComercio['telefono'].fillna("00000000")
    df_comercioComercio['direccion'] = df_comercioComercio['direccion'].fillna("Sin Dirección")
    df_comercioComercio['ciudad']    = df_comercioComercio['ciudad'].fillna("Desconocida")
    df_comercioComercio['pais']      = df_comercioComercio['pais'].fillna("Colombia")

    # Correcciones específicas
    if 'telefono' in df_comercioComercio.columns:
        df_comercioComercio['telefono']  = df_comercioComercio['telefono'].replace("Abc123", "00000000")

    # Convertir de nuevo a numérico
    df_comercioComercio['nit'] = pd.to_numeric(df_comercioComercio['nit'], errors='coerce').fillna(0).astype(int)
    df_comercioComercio['id']  = pd.to_numeric(df_comercioComercio['id'], errors='coerce').fillna(0).astype(int)
    df_comercioComercio['id_cliente']  = pd.to_numeric(df_comercioComercio['id_cliente'], errors='coerce').fillna(0).astype(int)

    # Ya no guardamos en archivo, devolvemos el resultado para uso inmediato
    print("Limpieza de Comercio completada en memoria.")
    
    return df_comercioComercio


# Función de limpieza para Categoría--------------------------------------------------------------------------------------  
def limpiar_datos_categoria(df_categoria):
    print("Limpiando datos de categoría...")

    # Limpieza de columnas de texto
    for col in ['id', 'id_cliente', 'Nombre', 'usuarioDecreacion', 'usuarioDemodificacion', 'estado']:
        if col in df_categoria.columns:
            df_categoria[col] = df_categoria[col].astype(str).str.strip().str.title()

    # Manejo de fechas: convertir a datetime y luego formatear si es necesario, o rellenar nulos con un valor datetime
    for date_col in ['fecha de creación', 'fecha de modificación']:
        if date_col in df_categoria.columns:
            df_categoria[date_col] = pd.to_datetime(df_categoria[date_col], errors='coerce')
            # Rellenar nulos con una fecha predeterminada si es necesario, o dejar como NaT para indicar nulo
            df_categoria[date_col] = df_categoria[date_col].fillna(pd.Timestamp('1900-01-01')) # Ejemplo: fecha muy antigua
            df_categoria[date_col] = df_categoria[date_col].dt.strftime('%Y-%m-%d') # Formatear a string si se prefiere

    # Eliminar duplicados
    df_categoria = df_categoria.drop_duplicates()

    # Reemplazar valores nulos
    df_categoria['id'] = df_categoria['id'].fillna("0")
    df_categoria['Nombre'] = df_categoria['Nombre'].fillna("Desconocido")
    df_categoria['fecha de creación'] = df_categoria['fecha de creación'].fillna("1900-01-01") # Coherente con el manejo de fechas
    df_categoria['fecha de modificación'] = df_categoria['fecha de modificación'].fillna("1900-01-01")
    df_categoria['usuarioDecreacion'] = df_categoria['usuarioDecreacion'].fillna("Sin Usuario")
    df_categoria['usuarioDemodificacion'] = df_categoria['usuarioDemodificacion'].fillna("Sin Usuario")
    df_categoria['estado'] = df_categoria['estado'].fillna("Desconocido")
    df_categoria['id_cliente'] = df_categoria['id_cliente'].fillna("0")

    # Convertir de nuevo a numérico
    df_categoria['id'] = pd.to_numeric(df_categoria['id'], errors='coerce').fillna(0).astype(int)
    df_categoria['id_cliente'] = pd.to_numeric(df_categoria['id_cliente'], errors='coerce').fillna(0).astype(int)

    # Ya no guardamos en archivo, devolvemos el resultado para uso inmediato
    print("Limpieza de Categoría completada en memoria.")
    
    return df_categoria


# Función de limpieza para Gastos Sucios--------------------------------------------------------------------------------------
def limpiar_datos_gastos(df_Gastos):
    print("Limpiando datos de Gastos...")

    # Eliminación de Duplicados.......................................................................
    print(f"Cantidad de registros antes de eliminar duplicados: {len(df_Gastos)}")
    df_Gastos = df_Gastos.drop_duplicates()
    print(f"Cantidad de registros después de eliminar duplicados: {len(df_Gastos)}")

    # limpieza de espacios en blanco y estandarización de mayúsculas...................................
    print("Limpiando espacios en blanco y estandarizando texto")
    for col in ['descripcion', 'imagen', 'medioPago', 'categoria', 'comercio', 'estado', 'notas']:
        if col in df_Gastos.columns:
            df_Gastos[col] = df_Gastos[col].astype(str).str.strip().str.title()

    # Eliminamos símbolos de moneda y comas ANTES de convertir a número
    print("Eliminación de símbolos de moneda y comas")
    if 'valor' in df_Gastos.columns:
        df_Gastos['valor'] = df_Gastos['valor'].astype(str).replace(r'(?i)[$,]|cop', '', regex=True)

    # Conversión de Tipos de Datos
    print("Conversión de tipos de datos")
    if 'fecha' in df_Gastos.columns:
        df_Gastos['fecha'] = pd.to_datetime(df_Gastos['fecha'], errors='coerce')
    if 'valor' in df_Gastos.columns:
        df_Gastos['valor'] = pd.to_numeric(df_Gastos['valor'], errors='coerce')

    #Tratamiento de nulos y NaN.......................................................................
    print("Tratamiento de nulos y NaN")
    df_Gastos["fecha"] = df_Gastos["fecha"].fillna(pd.Timestamp('2024-01-01')) # Rellenar con un objeto datetime
    df_Gastos['valor'] = df_Gastos['valor'].fillna(0)
    df_Gastos['descripcion'] = df_Gastos['descripcion'].fillna('Sin descripción')
    df_Gastos['imagen'] = df_Gastos['imagen'].fillna('Sin imagen')
    df_Gastos['medioPago'] = df_Gastos['medioPago'].fillna('Desconocido')
    df_Gastos['categoria'] = df_Gastos['categoria'].fillna('Sin categoría')
    df_Gastos['comercio'] = df_Gastos['comercio'].fillna('Sin comercio')
    df_Gastos['estado'] = df_Gastos['estado'].fillna('Desconocido')
    df_Gastos['notas'] = df_Gastos['notas'].fillna('Sin notas')

    # Verificación de Categorías Lógicas - Definimos la lista ANTES de usarla.........................
    print("Verificación de Categorías Lógicas")
    lista_estricta_Gastos = ['Alimentos',  'Ayuntamiento', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Educación', 'Ropa', 'Vivienda', 'Tecnología', 'Otros', 'Viajes', 'Sin Categoría'] # Añadir 'Sin Categoría'

    # Usamos ~ (NOT) para buscar a los que violan la regla de la lista estricta.......................
    if 'categoria' in df_Gastos.columns:
        mas_violaciones = ~df_Gastos['categoria'].isin(lista_estricta_Gastos)
        errores_Gastos = df_Gastos[mas_violaciones]

        if not errores_Gastos.empty:
            print("Gastos con categorías que no están en la lista estricta:")
            print(errores_Gastos[['descripcion', 'categoria', 'valor']])
        else:
            print("No se detectaron categorías inválidas en Gastos.")
    else:
        print("Columna 'categoria' no encontrada en el DataFrame de Gastos para validación.")
    
    # Formatear la fecha a string YYYY-MM-DD antes de guardar si es necesario
    df_Gastos['fecha'] = df_Gastos['fecha'].dt.strftime('%Y-%m-%d')

    # Ya no guardamos en archivo, devolvemos el resultado para uso inmediato
    print("Limpieza de Gastos completada en memoria.")
    
    return df_Gastos

# Función de limpieza para Usuarios Sucios--------------------------------------------------------------------------------------
def limpiar_datos_usuarios(df_Usuarios):
    print("Limpiando datos de Usuarios...")

    # Eliminación de Duplicados.......................................................................
    print(f"Cantidad de registros antes de eliminar duplicados: {len(df_Usuarios)}")
    df_Usuarios = df_Usuarios.drop_duplicates()
    df_Usuarios = df_Usuarios.drop_duplicates(subset='documento', keep='first')
    print(f"Cantidad de registros después de eliminar duplicados: {len(df_Usuarios)}")

    # Limpieza de espacios en blanco y estandarización.................................................
    print("Limpiando espacios en blanco y estandarizando texto")
    for col in ['nombre', 'tipoDocumento', 'documento', 'correo', 'telefono', 'direccion', 'ciudad', 'pais', 'estado']:
        if col in df_Usuarios.columns:
            df_Usuarios[col] = df_Usuarios[col].astype(str).str.strip()
            if col not in ['documento', 'telefono', 'correo']: # No aplicar title a estos
                df_Usuarios[col] = df_Usuarios[col].str.title()
    
    if 'tipoDocumento' in df_Usuarios.columns:
        df_Usuarios['tipoDocumento'] = df_Usuarios['tipoDocumento'].str.upper()
    if 'correo' in df_Usuarios.columns:
        df_Usuarios['correo'] = df_Usuarios['correo'].str.lower()


    # Conversión de Tipos de Datos.....................................................................
    print("Conversión de tipos de datos")
    if 'edad' in df_Usuarios.columns:
        df_Usuarios['edad'] = pd.to_numeric(df_Usuarios['edad'], errors='coerce')

    # Eliminación de caracteres extraños en teléfono...................................................
    print("Limpieza de teléfonos")
    if 'telefono' in df_Usuarios.columns:
        df_Usuarios['telefono'] = df_Usuarios['telefono'].str.replace(r'[^\d]', '', regex=True)

    # Eliminación de caracteres no alfanuméricos en documento..........................................
    print("Limpieza de documentos")
    if 'documento' in df_Usuarios.columns:
        df_Usuarios['documento'] = df_Usuarios['documento'].str.replace(r'[^a-zA-Z0-9]', '', regex=True)

    # Corrección de correos inválidos (sin '@')........................................................
    print("Corrección de correos inválidos")
    def corregir_correo(correo):
        if pd.isna(correo) or not isinstance(correo, str):
            return 'sin_correo@desconocido.com'
        if '@' not in correo:
            # Intentar inferir dominio si hay palabras clave
            for dominio in ['gmail', 'hotmail', 'yahoo', 'outlook']:
                if dominio in correo:
                    idx = correo.find(dominio)
                    return correo[:idx] + '@' + correo[idx:] + '.com' # Asumir .com
            return correo + '@corregido.com' # Dominio genérico si no se infiere
        return correo

    if 'correo' in df_Usuarios.columns:
        df_Usuarios['correo'] = df_Usuarios['correo'].apply(corregir_correo)

    # Tratamiento de nulos y NaN.......................................................................
    print("Tratamiento de nulos y NaN")
    if 'edad' in df_Usuarios.columns:
        mediana_edad = int(df_Usuarios['edad'].median()) if not df_Usuarios['edad'].isnull().all() else 0
        df_Usuarios['edad']      = df_Usuarios['edad'].fillna(mediana_edad).astype(int)
    else:
        df_Usuarios['edad'] = 0 # Si la columna no existe, añadirla con un valor por defecto

    df_Usuarios['nombre']    = df_Usuarios['nombre'].fillna('Sin Nombre')
    df_Usuarios['correo']    = df_Usuarios['correo'].fillna('sin_correo@desconocido.com')
    df_Usuarios['telefono']  = df_Usuarios['telefono'].fillna('Sin Teléfono')
    df_Usuarios['direccion'] = df_Usuarios['direccion'].fillna('Sin Dirección')
    df_Usuarios['ciudad']    = df_Usuarios['ciudad'].fillna('Desconocida')
    df_Usuarios['pais']      = df_Usuarios['pais'].fillna('Desconocido')
    df_Usuarios['estado']    = df_Usuarios['estado'].fillna('Desconocido')

    # Verificación de Estados Lógicos..................................................................
    print("Verificación de Estados Lógicos")
    lista_estricta_Usuarios = ['Activo', 'Inactivo']

    if 'estado' in df_Usuarios.columns:
        mas_violaciones = ~df_Usuarios['estado'].isin(lista_estricta_Usuarios)
        errores_Usuarios = df_Usuarios[mas_violaciones]

        if not errores_Usuarios.empty:
            print("Usuarios con estados que no están en la lista estricta:")
            print(errores_Usuarios[['documento', 'nombre', 'estado']])
        else:
            print("No se detectaron estados inválidos en Usuarios.")
    else:
        print("Columna 'estado' no encontrada en el DataFrame de Usuarios para validación.")


    # Marcar teléfonos incompletos (menos de 10 dígitos)..............................................
    print("Verificación de teléfonos incompletos")
    if 'telefono' in df_Usuarios.columns:
        mascara_incompleto = (
            df_Usuarios['telefono'].str.len() < 10
        ) & (df_Usuarios['telefono'] != 'Sin Teléfono')
        df_Usuarios.loc[mascara_incompleto, 'telefono'] = 'Teléfono Incompleto'
    else:
        print("Columna 'telefono' no encontrada en el DataFrame de Usuarios para validación.")


    # Ya no guardamos en archivo, devolvemos el resultado para uso inmediato
    print("Limpieza de Usuarios completada en memoria.")

    return df_Usuarios

def limpiar_csv_externo(df):
    """Mapeo inteligente y limpieza de archivos CSV externos (bancos)."""
    column_map = {}
    for col in df.columns:
        c_low = col.lower()
        if any(x in c_low for x in ['fec', 'date']): column_map[col] = 'fecha'
        elif any(x in c_low for x in ['desc', 'deta']): column_map[col] = 'descripcion'
        elif any(x in c_low for x in ['val', 'monto', 'amo']): column_map[col] = 'valor'
        elif 'cat' in c_low: column_map[col] = 'categoria'
        elif any(x in c_low for x in ['com', 'est']): column_map[col] = 'comercio'

    df = df.rename(columns=column_map)
    
    # Columnas obligatorias
    for col in ['fecha', 'descripcion', 'valor']:
        if col not in df.columns:
            raise ValueError(f"No se pudo identificar la columna '{col}'")

    # Transformaciones activas
    df['valor'] = df['valor'].replace(r'[\$,]', '', regex=True).astype(float).abs()
    df['fecha'] = pd.to_datetime(df['fecha']).dt.strftime('%Y-%m-%d')
    df['descripcion'] = df['descripcion'].str.title().str.strip()
    
    df = df.fillna({
        'categoria': 'Otros',
        'comercio': 'Desconocido',
        'notas': 'Importado vía Python'
    })
    
    return df