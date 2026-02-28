import numpy as np
import matplotlib.pyplot as plt

def project_pinhole(points_3d, K, R, t):
    
    points_cam = R @ points_3d + t

    Z = points_cam[2, :]
    Z[Z == 0] = 1e-6 

    points_img_hom = K @ points_cam

    u = points_img_hom[0, :] / Z
    v = points_img_hom[1, :] / Z

    return u, v, Z

vertices = np.array([
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
]).T

edges = [(0,1), (1,2), (2,3), (3,0), (4,5), (5,6), (6,7), (7,4), (0,4), (1,5), (2,6), (3,7)]

K = np.array([
    [800, 0, 400],
    [0, 800, 300],
    [0,   0,   1]
])

t = np.array([[0], [0], [5]])

R_identity = np.eye(3)

theta = np.radians(30)
R_rotated = np.array([
    [np.cos(theta), 0, np.sin(theta)],
    [0, 1, 0],
    [-np.sin(theta), 0, np.cos(theta)]
])

u1, v1, z1 = project_pinhole(vertices, K, R_identity, t)
u2, v2, z2 = project_pinhole(vertices, K, R_rotated, t)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

def draw_cube(ax, u, v, Z, title):
    ax.set_title(title)
    ax.set_xlim(0, 800); ax.set_ylim(600, 0) 
    ax.set_aspect('equal')
    ax.grid(True)
    scatter = ax.scatter(u, v, c=Z, cmap='viridis', s=50, zorder=5)
    for edge in edges:
        p1, p2 = edge
        if Z[p1] > 0 and Z[p2] > 0:
            ax.plot([u[p1], u[p2]], [v[p1], v[p2]], 'b-', alpha=0.6)

draw_cube(ax1, u1, v1, z1, "Cámara Frontal (R=Identidad)")
draw_cube(ax2, u2, v2, z2, "Cámara Rotada 30° en Y")

plt.tight_layout()
plt.show()