import numpy as np
import matplotlib.pyplot as plt
import imageio
import os

def matrix_translation(tx, ty):
    return np.array([
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1]
    ])

def matrix_rotation(theta):
    return np.array([
        [np.cos(theta), -np.sin(theta), 0],
        [np.sin(theta),  np.cos(theta), 0],
        [0, 0, 1]
    ])

def matrix_scale(sx, sy):
    return np.array([
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
    ])

cuadrado = np.array([
    [-1, -1, 1],
    [ 1, -1, 1],
    [ 1,  1, 1],
    [-1,  1, 1],
    [-1, -1, 1]
]).T

frames = []
num_frames = 60
filenames = []

print("Procesando transformaciones y renderizando frames...")

for i in range(num_frames):
    t = (i / num_frames) * 2 * np.pi 
    tx = np.sin(t) * 5
    ty = np.cos(t) * 3
    theta = t * 2
    scale = 1 + np.sin(t * 4) * 0.5

    M = matrix_translation(tx, ty) @ matrix_rotation(theta) @ matrix_scale(scale, scale)

    transformado = M @ cuadrado

    fig, ax = plt.subplots(figsize=(5, 5))
    ax.plot(transformado[0, :], transformado[1, :], color='blue', linewidth=2)
    ax.set_xlim(-10, 10)
    ax.set_ylim(-10, 10)
    ax.grid(True, linestyle='--', alpha=0.6)
    ax.set_title(f"M = T * R * S | Tiempo (t) = {t:.2f}")
    
    filename = f"frame_{i}.png"
    filenames.append(filename)
    plt.savefig(filename)
    plt.close()

gif_path = "python_1_4_transformaciones.gif"
print(f"Empaquetando frames en {gif_path}...")

for filename in filenames:
    frames.append(imageio.v2.imread(filename))
imageio.mimsave(gif_path, frames, fps=30)

for filename in filenames:
    os.remove(filename)

print("¡Proceso terminado exitosamente!")