using UnityEngine;

public class TransformacionesBasicas : MonoBehaviour
{
    [Header("Configuración de Tiempo")]
    public float tiempoCambioPosicion = 2f;
    private float timer = 0f;

    void Update()
    {
        timer += Time.deltaTime;
        if (timer >= tiempoCambioPosicion)
        {
            float randomX = Random.Range(-4f, 4f);
            float randomY = Random.Range(-3f, 3f);
            
            transform.position = new Vector3(randomX, randomY, 0f);
            
            timer = 0f;
        }

        transform.Rotate(new Vector3(45f, 90f, 0f) * Time.deltaTime);

        float escala = 1f + (Mathf.Sin(Time.time * 3f) * 0.5f);
        transform.localScale = new Vector3(escala, escala, escala);
    }
}