import numpy as np
import cv2
import glob
import os
import urllib.request
import matplotlib.pyplot as plt


DIR_IMGS = '../calibration_images'
os.makedirs(DIR_IMGS, exist_ok=True)

imagenes_prueba = [f'left{i:02d}.jpg' for i in range(1, 15)]
base_url = "https://raw.githubusercontent.com/opencv/opencv/master/samples/data/"

if len(os.listdir(DIR_IMGS)) == 0:
    print("[Pipeline] Descargando imágenes de calibración...")
    for img_name in imagenes_prueba:
        try:
            urllib.request.urlretrieve(base_url + img_name, os.path.join(DIR_IMGS, img_name))
        except Exception as e:
            pass
    print("[Pipeline] Imágenes descargadas.")

CHECKERBOARD = (9, 6)
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

objp = np.zeros((CHECKERBOARD[0] * CHECKERBOARD[1], 3), np.float32)
objp[:, :2] = np.mgrid[0:CHECKERBOARD[0], 0:CHECKERBOARD[1]].T.reshape(-1, 2)

objpoints = [] 
imgpoints = [] 

images = glob.glob(f'{DIR_IMGS}/*.jpg')
print(f"[Pipeline] Analizando {len(images)} imágenes encontradas...")

img_shape = None
for fname in images:
    img = cv2.imread(fname)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if img_shape is None: img_shape = gray.shape[::-1]

    ret, corners = cv2.findChessboardCorners(gray, CHECKERBOARD, None)

    if ret:
        objpoints.append(objp)
        corners2 = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
        imgpoints.append(corners2)

print("[Pipeline] Calculando matrices intrínsecas y extrínsecas...")
ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, img_shape, None, None)

print("\n--- RESULTADOS DE CALIBRACIÓN ---")
print(f"Matriz Intrínseca (K):\n{mtx}")
print(f"Coeficientes de Distorsión Radial/Tangencial (D):\n{dist}")

img_test = cv2.imread(images[0])
h, w = img_test.shape[:2]
newcameramtx, roi = cv2.getOptimalNewCameraMatrix(mtx, dist, (w, h), 1, (w, h))

dst = cv2.undistort(img_test, mtx, dist, None, newcameramtx)

x, y, w_roi, h_roi = roi
dst = dst[y:y+h_roi, x:x+w_roi]
mean_error = 0
for i in range(len(objpoints)):
    imgpoints2, _ = cv2.projectPoints(objpoints[i], rvecs[i], tvecs[i], mtx, dist)
    error = cv2.norm(imgpoints[i], imgpoints2, cv2.NORM_L2) / len(imgpoints2)
    mean_error += error
total_error = mean_error / len(objpoints)
print(f"Error medio de reproyección: {total_error:.4f} píxeles")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
ax1.imshow(cv2.cvtColor(img_test, cv2.COLOR_BGR2RGB))
ax1.set_title('Original (Con Distorsión)')
ax1.axis('off')

ax2.imshow(cv2.cvtColor(dst, cv2.COLOR_BGR2RGB))
ax2.set_title('Corregida (Undistorted)')
ax2.axis('off')

plt.tight_layout()
plt.show()