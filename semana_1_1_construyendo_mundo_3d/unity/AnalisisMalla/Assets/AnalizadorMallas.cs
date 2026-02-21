using UnityEngine;
using TMPro;

public class AnalizadorMallas : MonoBehaviour
{
    [Header("Interfaz de Usuario")]
    public TextMeshProUGUI textoEstadisticas;
    
    private MeshRenderer[] renderizadoresEstaticos;
    private SkinnedMeshRenderer[] renderizadoresAnimados;
    private bool mostrandoWireframe = false;

    void Start()
    {
        renderizadoresEstaticos = GetComponentsInChildren<MeshRenderer>();
        renderizadoresAnimados = GetComponentsInChildren<SkinnedMeshRenderer>();

        int vertices = 0;
        int triangulos = 0;
        int subMallas = 0;

        foreach (var mf in GetComponentsInChildren<MeshFilter>())
        {
            if (mf.sharedMesh != null)
            {
                vertices += mf.sharedMesh.vertexCount;
                triangulos += mf.sharedMesh.triangles.Length / 3;
                subMallas += mf.sharedMesh.subMeshCount;
            }
        }

        foreach (var smr in renderizadoresAnimados)
        {
            if (smr.sharedMesh != null)
            {
                vertices += smr.sharedMesh.vertexCount;
                triangulos += smr.sharedMesh.triangles.Length / 3;
                subMallas += smr.sharedMesh.subMeshCount;
            }
        }

        if (textoEstadisticas != null)
        {
            textoEstadisticas.text = $"Topología del Modelo:\n" +
                                     $"Vértices Totales: {vertices}\n" +
                                     $"Triángulos: {triangulos}\n" +
                                     $"Partes (Sub-Mallas): {subMallas}";
        }
    }

    public void AlternarVista()
    {
        mostrandoWireframe = !mostrandoWireframe;
        
        foreach (var r in renderizadoresEstaticos) r.enabled = !mostrandoWireframe;
        foreach (var r in renderizadoresAnimados) r.enabled = !mostrandoWireframe;
    }

    void OnDrawGizmos()
    {
        if (!mostrandoWireframe) return;

        Gizmos.color = Color.cyan;

        foreach (var mf in GetComponentsInChildren<MeshFilter>())
        {
            if (mf.sharedMesh != null)
                Gizmos.DrawWireMesh(mf.sharedMesh, mf.transform.position, mf.transform.rotation, mf.transform.lossyScale);
        }

        foreach (var smr in GetComponentsInChildren<SkinnedMeshRenderer>())
        {
            if (smr.sharedMesh != null)
                Gizmos.DrawWireMesh(smr.sharedMesh, smr.transform.position, smr.transform.rotation, smr.transform.lossyScale);
        }
    }
}