import trimesh
import numpy as np
import os

archivos = ["modelo.obj", "modelo.stl", "modelo.glb"]

def comparar_y_visualizar():
    print("INICIANDO SCRIPT AUTOMATIZADO DE COMPARACIÓN\n")
    
    print(f"{'Formato':<12} | {'Vértices':<10} | {'Caras':<10} | {'Normales':<10} | {'Duplicados':<12} | {'Cerrada'}")
    print("-" * 75)
    
    mallas_para_escena = []
    desplazamiento_x = 0
    
    for archivo in archivos:
        if not os.path.exists(archivo):
            print(f"Error: No se encontró el archivo {archivo}.")
            continue
            
        malla = trimesh.load(archivo, force='mesh', skip_materials=True)
        
        verts = len(malla.vertices)
        caras = len(malla.faces)
        normales = len(malla.face_normals)
        
        unicos = len(np.unique(malla.vertices, axis=0))
        duplicados = verts - unicos
        
        cerrada = "Sí" if malla.is_watertight else "No"
        
        print(f"{archivo:<12} | {verts:<10} | {caras:<10} | {normales:<10} | {duplicados:<12} | {cerrada}")
        
        malla_vis = malla.copy()
        
        malla_vis.apply_translation([desplazamiento_x, 0, 0])
        ancho_modelo = malla.extents[0]
        desplazamiento_x += ancho_modelo * 1.5 
        
        if "obj" in archivo:
            malla_vis.visual.face_colors = [255, 150, 0, 255]   # Naranja
        elif "stl" in archivo:
            malla_vis.visual.face_colors = [0, 200, 255, 255]   # Celeste
        else:
            malla_vis.visual.face_colors = [150, 255, 100, 255] # Verde
            
        mallas_para_escena.append(malla_vis)

    print("-" * 75)
    
    print("\nAbriendo escena 3D comparativa...")
    print("Orden de izquierda a derecha: OBJ (Naranja), STL (Celeste), GLB (Verde)")
    
    escena = trimesh.Scene(mallas_para_escena)
    escena.show()

if __name__ == "__main__":
    comparar_y_visualizar()