import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def trans2d(tx, ty):
    return np.array([[1, 0, tx], [0, 1, ty], [0, 0, 1]])

def rot2d(theta_deg):
    th = np.radians(theta_deg)
    c, s = np.cos(th), np.sin(th)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

def scale2d(sx, sy):
    return np.array([[sx, 0, 0], [0, sy, 0], [0, 0, 1]])

def trans3d(tx, ty, tz):
    return np.array([[1, 0, 0, tx], [0, 1, 0, ty], [0, 0, 1, tz], [0, 0, 0, 1]])

def rot3d_z(theta_deg):
    th = np.radians(theta_deg)
    c, s = np.cos(th), np.sin(th)
    return np.array([[c, -s, 0, 0], [s, c, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])

fig = plt.figure(figsize=(15, 5))

ax1 = fig.add_subplot(131)
ax1.set_title("2D: T*R vs R*T (No Conmutativo)")
ax1.grid(True); ax1.axis('equal'); ax1.set_xlim(-2, 8); ax1.set_ylim(-2, 8)

cuadrado = np.array([[0, 1, 1, 0, 0], [0, 0, 1, 1, 0], [1, 1, 1, 1, 1]])
ax1.plot(cuadrado[0], cuadrado[1], 'k-', label='Original', linewidth=2)

T_A = trans2d(5, 0) @ rot2d(45)
res_A = T_A @ cuadrado
ax1.plot(res_A[0], res_A[1], 'b-', label='T * R (Correcto)')

T_B = rot2d(45) @ trans2d(5, 0)
res_B = T_B @ cuadrado
ax1.plot(res_B[0], res_B[1], 'r-', label='R * T (Orbita)')
ax1.legend()

ax2 = fig.add_subplot(132, projection='3d')
ax2.set_title("3D: Inversa (Deshacer Transformación)")
ax2.set_xlim([-3, 3]); ax2.set_ylim([-3, 3]); ax2.set_zlim([-3, 3])

cubo = np.array([
    [0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
])

M_cubo = trans3d(1, 2, 1) @ rot3d_z(45)
cubo_trans = M_cubo @ cubo
ax2.plot(cubo_trans[0], cubo_trans[1], cubo_trans[2], 'r-', label='Transformado')
M_inv = np.linalg.inv(M_cubo)
cubo_restaurado = M_inv @ cubo_trans
ax2.plot(cubo_restaurado[0], cubo_restaurado[1], cubo_restaurado[2], 'g--', label='T_inv * Transformado', linewidth=3)
ax2.legend()

ax3 = fig.add_subplot(133)
ax3.set_title("Robótica: Cinemática Directa")
ax3.grid(True); ax3.axis('equal'); ax3.set_xlim(-1, 8); ax3.set_ylim(-1, 8)
L1, L2, L3 = 3.0, 2.0, 1.5
theta1, theta2, theta3 = 45, -30, -45

H01 = rot2d(theta1)
H12 = trans2d(L1, 0) @ rot2d(theta2)
H23 = trans2d(L2, 0) @ rot2d(theta3)
H34 = trans2d(L3, 0)
T01 = H01
T02 = H01 @ H12
T03 = H01 @ H12 @ H23
T04 = H01 @ H12 @ H23 @ H34

origen = np.array([0, 0, 1])
p0 = np.array([0, 0, 1])
p1 = T01 @ origen
p2 = T02 @ origen
p3 = T03 @ origen
p4 = T04 @ origen

xs = [p0[0], p1[0], p2[0], p3[0], p4[0]]
ys = [p0[1], p1[1], p2[1], p3[1], p4[1]]

ax3.plot(xs, ys, 'o-', color='purple', linewidth=3, markersize=8, label='Brazo')
ax3.plot(p4[0], p4[1], 'r*', markersize=15, label='End Effector')
ax3.legend()

plt.tight_layout()
plt.show()

print("\n--- MATRIZ IDENTIDAD (T * T_inv) ---")
Identidad = np.round(M_cubo @ M_inv, 2)
print(Identidad)