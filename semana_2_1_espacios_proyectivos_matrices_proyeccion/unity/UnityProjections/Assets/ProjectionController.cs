using UnityEngine;
using UnityEngine.InputSystem; // <-- Invocamos el nuevo sistema

[RequireComponent(typeof(Camera))]
public class ProjectionController : MonoBehaviour
{
    private Camera cam;

    [Header("Configuración de Proyección")]
    [Tooltip("Presiona la barra ESPACIADORA para cambiar la matriz")]
    [Range(10f, 120f)] public float perspectiveFOV = 60f;
    [Range(1f, 20f)] public float orthographicSize = 5f;

    [Header("Clipping Planes")]
    public float nearPlane = 0.3f;
    public float farPlane = 1000f;

    void Start()
    {
        cam = GetComponent<Camera>();
        UpdateCameraSettings();
    }

    void Update()
    {
        // Interceptamos el teclado usando la API del New Input System
        // Al presionar espacio, reconstruimos la matriz de proyección y la enviamos al pipeline
        if (Keyboard.current != null && Keyboard.current.spaceKey.wasPressedThisFrame)
        {
            cam.orthographic = !cam.orthographic;
            Debug.Log($"[Pipeline] Matriz cambiada a: {(cam.orthographic ? "Ortogonal" : "Perspectiva")}");
        }

        UpdateCameraSettings();
    }

    private void UpdateCameraSettings()
    {
        cam.nearClipPlane = nearPlane;
        cam.farClipPlane = farPlane;

        if (cam.orthographic)
        {
            cam.orthographicSize = orthographicSize;
        }
        else
        {
            cam.fieldOfView = perspectiveFOV;
        }
    }
}