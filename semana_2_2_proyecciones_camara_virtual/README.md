# Taller Proyecciones Camara Virtual

**Nombre del estudiante:** Brayan Alejandro Muñoz Pérez  
**Fecha de entrega:** 27 de Febrero de 2026  
**Asignatura:** Computación Gráfica (2026-I) - Universidad Nacional de Colombia  

---

## 📘 Descripción del Taller

El objetivo de este taller es comprender cómo se genera una escena 3D desde el punto de vista de una cámara virtual, analizando su impacto directo en el *Screen Space* (pantalla). Se exploraron las diferencias visuales y matemáticas entre el frustum de **Perspectiva** (que simula la convergencia visual mediante la coordenada homogénea $w$) y el volumen **Ortográfico** (que mantiene escalas paralelas). Además, se extrajeron y visualizaron los datos intrínsecos del pipeline (Matrices de Proyección y Coordenadas Normalizadas de Dispositivo - NDC) en tiempo real.

---

## 💻 Implementaciones por Entorno

### 1. Three.js con React Three Fiber (Web/WebGL)
Se construyó una escena con geometrías a distintas profundidades (eje $Z$). Para evitar colapsar el reconciliador de React (que se asfixiaría al intentar re-renderizar un componente 60 veces por segundo), se implementó un sistema híbrido: una capa WebGL estricta (`<Canvas>`) y una capa HUD en HTML superpuesta.
* **Bonus Matemático:** Se utilizó `Vector3.project(camera)` dentro del ciclo `useFrame`. Matemáticamente, esto replica la transformación del Vertex Shader pasando del *World Space* al *Clip Space* mediante $V_{clip} = P \cdot V \cdot V_{world}$, y tras la división por $w$, entrega el vector en NDC (valores de $-1$ a $1$). Luego se aplicó un *Viewport Transform* manual para mapear estos valores a píxeles exactos en la pantalla.

### 2. Unity HDRP (Motor Gráfico)
Se implementó una escena isométrica utilizando el High Definition Render Pipeline. Se desarrolló un script (`CameraProjectionUI.cs`) que controla dinámicamente las propiedades del componente `Camera` (cambiando entre FOV y Orthographic Size). 
* Se solucionaron conflictos de interfaz adaptando el `EventSystem` al **New Input System**.
* Se extrajo la matriz de proyección pura enviada a la GPU (`camera.projectionMatrix`) y se imprimió en consola, evidenciando el cambio en la última fila (de `[0, 0, -1, 0]` en perspectiva a `[0, 0, 0, 1]` en ortogonal).

---

## 🖼️ Resultados Visuales

### Three.js / R3F
Muestra del HUD en tiempo real calculando las transformaciones matemáticas desde 3D hasta los píxeles bidimensionales de la pantalla.

![Three.js HUD Dinámico](media/three_hud.gif)
![Three.js Cambio de Cámara](media/threejs_camara.gif)

### Unity HDRP
Interacción con la UI de Unity, superando las trampas de los parámetros estáticos vs dinámicos en los eventos, y visualizando el cambio geométrico.

*(Nota: Asegúrate de subir tu GIF de Unity a la carpeta media y verificar este nombre)*
![Unity Interacción UI](media/unity_camara_virtual.gif) 

---

## 📄 Código Relevante

**Extracción del NDC y Screen Space en Three.js (Optimizado sin matar a React):**
```javascript
useFrame(() => {
    const clonePos = targetPos.clone();
    
    // Proyección de World Space a NDC (Normalized Device Coordinates)
    clonePos.project(camera);

    // Viewport Transform (Mapeo a Píxeles)
    const pxX = ((clonePos.x + 1) / 2) * size.width;
    const pxY = (-(clonePos.y - 1) / 2) * size.height;

    // Mutación directa del DOM para alto rendimiento a 60 FPS
    const elNdc = document.getElementById('hud-ndc');
    if (elNdc) elNdc.innerText = `[${clonePos.x.toFixed(2)}, ${clonePos.y.toFixed(2)}]`;
});

```

**Lectura de la Matriz de Proyección en Unity:**

```csharp
private void PrintMatrix()
{
    Matrix4x4 p = cam.projectionMatrix;
    Debug.Log($"Matriz de Proyección (Pipeline):\n{p}");
}

```

---

## 🤖 Prompts Utilizados (IA Generativa)

* *Consultas de rendimiento WebGL:* "Se ve todo negro en localhost". Llevó a la refactorización separando la lógica HTML del ciclo `useFrame` del `<Canvas>` para no bloquear el hilo de React.
* *Debugeo de Eventos en Unity:* "No funciona ni el botón, ni el slider". Reveló problemas de migración al New Input System y la diferencia crítica entre *Dynamic Float* y *Static Parameters* en los eventos de UI.
* *Lógica de variables ocultas:* "El slider no hace nada, se oculta en perspectiva". Explicación sobre la irrelevancia del Orthographic Size cuando la cámara usa FOV.
* Corrección de estilo y complementar el `README.md`

## 🧠 Aprendizajes y Dificultades

1. **React vs WebGL:** Intentar actualizar estados de React en cada frame (`setHudData`) es un anti-patrón en gráficas 3D. Aprendí a usar referencias cruzadas mutando atributos del DOM (`innerText`) directamente desde el bucle de renderizado para mantener los 60 FPS.
2. **Unity UI y el EventSystem:** Los Canvas en Unity dependen críticamente de los módulos de Input. Al usar HDRP, el sistema antiguo se desactiva, requiriendo un reemplazo manual del módulo en el `EventSystem`.
3. **Delegados Dinámicos vs Estáticos:** En el inspector de Unity, al vincular un Slider a un método, es fácil elegir por error la versión estática del método, lo que causa que la función se llame pero sin recibir el valor real del componente.
4. **Matemática Aplicada:** Observar la función `Vector3.project` en acción desmitifica la renderización. Convertir un vector 3D en algo de 2D no es más que multiplicar matrices y dividir por $w$ para colapsar la profundidad.
