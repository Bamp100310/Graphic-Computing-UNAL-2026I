# Taller Construyendo Mundo 3D  
## Semana 1.1 – Vértices, Aristas y Caras

**Nombre:** Brayan Alejandro Muñoz Pérez  
**Asignatura:** Computación Visual – UNAL 2026-I  
**Fecha de entrega:** 11/02/2026

---

## 📌 Descripción del Taller

El objetivo de este taller es comprender la estructura fundamental de los modelos 3D a través del estudio de las mallas poligonales, identificando claramente la diferencia entre:

- Vértices
- Aristas
- Caras

Se trabajó con formatos estándar de malla como `.OBJ`, `.STL` y `.GLTF`, visualizando y analizando su estructura en distintos entornos de desarrollo.

---

## 🧠 Conceptos Clave

- **Vértice:** Punto en el espacio tridimensional definido por coordenadas (x, y, z).
- **Arista:** Segmento que conecta dos vértices.
- **Cara:** Superficie formada por tres o más vértices (generalmente triángulos).

Las mallas poligonales están compuestas por estos tres elementos fundamentales.

---

# 🐍 Implementación 1 – Python (trimesh / vedo)

### 🔧 Herramientas utilizadas
- Python
- trimesh
- numpy
- matplotlib

### 📌 Desarrollo

Se cargó un modelo 3D en formato `.OBJ` utilizando `trimesh`.  
Se extrajo información estructural del modelo:

- Número de vértices
- Número de aristas
- Número de caras

Se visualizó la malla:
- En modo sólido
- En modo wireframe
- Con puntos resaltando los vértices

### 📊 Información estructural del modelo

```python
import trimesh

mesh = trimesh.load("modelo.obj")

print("Vertices:", len(mesh.vertices))
print("Edges:", len(mesh.edges))
print("Faces:", len(mesh.faces))
