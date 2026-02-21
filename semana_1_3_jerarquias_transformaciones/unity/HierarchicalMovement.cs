using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ControladorJerarquia : MonoBehaviour
{
    public Transform sol;
    public Transform planeta;
    public Transform luna;
    public Slider sliderVelocidad;
    public TextMeshProUGUI textoInfo;

    void Update()
    {
        float velocidad = sliderVelocidad.value * 100f;

        sol.Rotate(Vector3.up * (velocidad * 0.2f) * Time.deltaTime);

        planeta.RotateAround(sol.position, Vector3.up, velocidad * Time.deltaTime);

        if (luna != null)
        {
            luna.RotateAround(planeta.position, Vector3.up, (velocidad * 2.5f) * Time.deltaTime);
        }

        textoInfo.text = $"Rotación Sol: {sol.eulerAngles.y:F0}°\n" +
                         $"Posición Planeta: {planeta.position}";
    }
}