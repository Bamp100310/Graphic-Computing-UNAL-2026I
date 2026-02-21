import trimesh
import numpy as np
import os

archivo_origen = "modelo.obj"

def analizar_y_convertir():
    if not os.path.exists(archivo_origen):
        print(f"Error: No se encontró '{archivo_origen}'. Cópialo a esta carpeta primero.")
        return

    print(f"CARGANDO Y ANALIZANDO: {archivo_origen}")
    malla = trimesh.load(archivo_origen, force='mesh', skip_materials=True)
    
    print(f"Vértices totales: {len(malla.vertices)}")
    print(f"Caras (Triángulos): {len(malla.faces)}")
    print(f"Normales de caras calculadas: {len(malla.face_normals)}")
    print(f"¿Es una malla cerrada (watertight)?: {'Sí' if malla.is_watertight else 'No'}")
    
    vertices_unicos = len(np.unique(malla.vertices, axis=0))
    duplicados = len(malla.vertices) - vertices_unicos
    print(f"Vértices duplicados encontrados: {duplicados}")

    print("\nCONVIRTIENDO FORMATOS")
    ruta_stl = "modelo.stl"
    ruta_glb = "modelo.glb" 

    try:
        malla.export(ruta_stl)
        print(f"Exportado exitosamente a: {ruta_stl}")
        
        malla.export(ruta_glb)
        print(f"Exportado exitosamente a: {ruta_glb}")
    except Exception as e:
        print(f"Error al exportar: {e}")

    print("\nVISUALIZACIÓN")
    print("Abriendo visualizador nativo de Trimesh... (Cierra la ventana para terminar)")
    malla.show(line_settings={'point_size': 5})

if __name__ == "__main__":
    analizar_y_convertir()