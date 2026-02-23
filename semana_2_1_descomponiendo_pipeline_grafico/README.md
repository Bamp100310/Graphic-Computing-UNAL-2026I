# Actividad S2_1 - Descomponiendo el Pipeline Gráfico

**Tema seleccionado:** Tema 6 - Depth Buffer y Visibilidad

**Nombre del estudiante:** Brayan Alejandro Muñoz Pérez

**Fecha de entrega:** 23 de Febrero de 2026

## Descripción del tema

El **Depth Buffer** (o Z-buffer) es una etapa fundamental del pipeline gráfico encargada de resolver la visibilidad de los fragmentos en una escena 3D. Funciona almacenando la distancia de cada píxel respecto a la cámara en una textura de profundidad. Antes de dibujar un nuevo píxel, la GPU realiza un **Depth Test**: si el nuevo fragmento está más cerca que el valor almacenado, se actualiza el buffer y se dibuja; de lo contrario, el fragmento se descarta para evitar el sobrecoste de renderizado de objetos ocultos.

## Explicación matemática resumida

La precisión del Depth Buffer no es lineal, lo que otorga una resolución mucho mayor a los objetos cercanos. La profundidad normalizada se calcula mediante la siguiente ecuación de proyección:

Cuando el plano **Near** es muy pequeño en comparación con un **Far** muy extenso, la precisión de los bits se agota rápidamente en la distancia, provocando errores de redondeo que resultan en el fenómeno de **Z-fighting**.

## Descripción de la implementación

Se desarrolló una aplicación interactiva utilizando **React Three Fiber** y la librería de control **Leva** para manipular el pipeline en tiempo real. La implementación incluye:

* **Simulación de Z-fighting:** Un plano rojo posicionado casi coplanar al suelo para demostrar la inestabilidad de píxeles.
* **Visualización de Profundidad:** Un shader personalizado (`ShaderMaterial`) que linealiza el buffer de profundidad para mostrarlo en escala de grises.
* **Mitigación técnica:** Uso de la propiedad `polygonOffset` para desplazar artificialmente la profundidad de la malla en el espacio de proyección sin alterar su posición física.

## Resultados visuales

*(Los recursos se encuentran en la carpeta `media/`)*

### 1. Interfaz Web e Interacción

*GIF mostrando la manipulación de los planos Near/Far, la activación del modo Depth y la visualización de la jerarquía en funcionamiento.*

### 2. Solución de Conflictos de Profundidad

*Captura de pantalla donde se aprecia el Z-fighting corregido mediante la aplicación de **Polygon Offset** en el plano rojo.*

## Código relevante

**Linealización del Depth Buffer en el Fragment Shader:**

```glsl
// Protección contra división por cero y mapeo lineal de profundidad
float range = max(uFar - uNear, 0.01);
float linearDepth = clamp((vDepth - uNear) / range, 0.0, 1.0);
gl_FragColor = vec4(vec3(linearDepth), 1.0);

```

**Configuración de la Cámara con Props dinámicas:**

```jsx
// Uso de PerspectiveCamera de @react-three/drei para evitar errores de NaN
<PerspectiveCamera 
  makeDefault 
  near={settings.near} 
  far={settings.far} 
  position={[10, 10, 15]} 
/>

```

## Prompts utilizados

* Optimización de un Shader de profundidad para evitar pantallas negras con valores de **Far** elevados.
* Resolución de errores de tipo **NaN** en la interfaz de **Leva** mediante la reestructuración de carpetas y etiquetas de estado.

## Aprendizajes y dificultades

* **Aprendizajes:** Comprendí la importancia crítica de la configuración de la cámara en la estabilidad visual de una escena. Aprendí a utilizar shaders para diagnosticar problemas internos del pipeline como la distribución de precisión en el eje Z.
* **Dificultades:** La mayor dificultad fue estabilizar la comunicación entre los estados de React y las matrices de la cámara de Three.js, lo que inicialmente causaba errores de cálculo numérico (**NaN**) en la interfaz de usuario.