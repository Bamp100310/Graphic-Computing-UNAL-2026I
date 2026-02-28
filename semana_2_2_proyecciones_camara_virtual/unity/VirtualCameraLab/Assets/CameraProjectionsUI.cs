using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(Camera))]
public class CameraProjectionUI : MonoBehaviour
{
    private Camera cam;

    [Header("Referencias UI")]
    public Slider orthoSizeSlider;

    void Start()
    {
        cam = GetComponent<Camera>();
        
        // Configuramos el estado inicial de la UI
        if (orthoSizeSlider != null)
        {
            orthoSizeSlider.gameObject.SetActive(cam.orthographic);
        }

        Debug.Log("[Pipeline Inicializado]");
        PrintMatrix();
    }

    // Método público para ser llamado por el OnClick del Botón
    public void ToggleProjectionMode()
    {
        cam.orthographic = !cam.orthographic;
        
        // Activa o desactiva el slider dependiendo del modo
        if (orthoSizeSlider != null)
        {
            orthoSizeSlider.gameObject.SetActive(cam.orthographic);
        }

        Debug.Log($"--- CAMBIO DE MODO: {(cam.orthographic ? "ORTOGRÁFICO" : "PERSPECTIVA")} ---");
        PrintMatrix();
    }

    // Método público para ser llamado por el OnValueChanged del Slider
    public void UpdateOrthographicSize(float newSize)
    {
        if (cam.orthographic)
        {
            cam.orthographicSize = newSize;
        }
    }

    // El Bonus del Taller: Imprimir la matriz matemática pura
    private void PrintMatrix()
    {
        Matrix4x4 p = cam.projectionMatrix;
        Debug.Log($"Matriz de Proyección que viaja a la GPU:\n{p}");
    }
}