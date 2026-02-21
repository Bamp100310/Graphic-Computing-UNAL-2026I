import trimesh
from vedo import Mesh, Spheres, Plotter, Video, Text2D
import os

ruta_modelo = "../threejs/public/modelo.obj"
ruta_gif = "../media/python_animacion.gif"

def analizar_y_exportar():
    if not os.path.exists(ruta_modelo):
        print(f"Error: No se encontró el archivo en {ruta_modelo}")
        return

    print(f"Cargando modelo desde: {ruta_modelo}...\n")
    
    malla_tri = trimesh.load(ruta_modelo, force='mesh', skip_materials=True)
    num_vertices = len(malla_tri.vertices)
    num_caras = len(malla_tri.faces)
    num_aristas = len(malla_tri.edges)
    
    texto_info = f"Estructura del Modelo\n-------------------\nVertices: {num_vertices}\nCaras: {num_caras}\nAristas: {num_aristas}"

    malla_vedo = Mesh(ruta_modelo)
    
    caras = malla_vedo.clone().color("yellow").alpha(0.7)
    
    aristas = malla_vedo.clone().wireframe(True).color("black").linewidth(1)
    
    vertices = Spheres(malla_tri.vertices, r=0.003, c="red")

    texto_2d = Text2D(texto_info, pos="top-left", s=1.1, c="black", bg="white", alpha=0.8)

    objetos_3d = [caras, aristas, vertices]
    todos_los_objetos = objetos_3d + [texto_2d]

    print(f"Generando animación rotatoria...")
    
    plt = Plotter(axes=1, title="Taller Construyendo el Mundo 3D")
    plt.show(todos_los_objetos, interactive=False)

    video = Video(ruta_gif, duration=3, backend='imageio')

    for i in range(60):
        for obj in objetos_3d:
            obj.rotate_y(6)
        plt.render()
        video.add_frame()
    
    video.close()
    print(f"¡Éxito! GIF exportado en: {ruta_gif}\n")

    print("Abriendo visualizador interactivo... (Cierra la ventana para terminar)")
    plt.show(todos_los_objetos, interactive=True)

if __name__ == "__main__":
    analizar_y_exportar()