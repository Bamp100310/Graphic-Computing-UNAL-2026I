import numpy as np
import matplotlib.pyplot as plt

def proyectar_perspectiva(puntos_3d, d=1.0):
    P = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1/d, 0]
    ])
    
    puntos_hom = np.vstack((puntos_3d, np.ones((1, puntos_3d.shape[1]))))
    
    proy = P @ puntos_hom
    
    w = proy[-1, :]
    w[w == 0] = 1e-6 
    
    proy_ndc = proy / w
    
    return proy_ndc[:2, :]

def proyectar_ortogonal(puntos_3d):
    P = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1]
    ])
    puntos_hom = np.vstack((puntos_3d, np.ones((1, puntos_3d.shape[1]))))
    proy = P @ puntos_hom
    return proy[:2, :]

puntos = np.array([
    [-1, 1, 1,-1,-1, 1, 1,-1],
    [-1,-1, 1, 1,-1,-1, 1, 1],
    [ 2, 2, 2, 2, 4, 4, 4, 4]
])

proy_persp = proyectar_perspectiva(puntos, d=2.0)
proy_orto = proyectar_ortogonal(puntos)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

ax1.scatter(proy_orto[0, :], proy_orto[1, :], c='blue')
ax1.set_title("Proyección Ortogonal\n(Sin sensación de profundidad)")
ax1.grid(True); ax1.set_xlim(-2, 2); ax1.set_ylim(-2, 2)
ax2.scatter(proy_persp[0, :], proy_persp[1, :], c='red')
ax2.set_title("Proyección Perspectiva\n(Vértices lejanos convergen)")
ax2.grid(True); ax2.set_xlim(-2, 2); ax2.set_ylim(-2, 2)

caras = [[0,1,2,3,0], [4,5,6,7,4], [0,4], [1,5], [2,6], [3,7]]
for cara in caras:
    ax1.plot(proy_orto[0, cara], proy_orto[1, cara], 'b-', alpha=0.5)
    ax2.plot(proy_persp[0, cara], proy_persp[1, cara], 'r-', alpha=0.5)

plt.tight_layout()
plt.show()