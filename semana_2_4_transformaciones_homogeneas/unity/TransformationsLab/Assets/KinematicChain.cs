using UnityEngine;

public class KinematicChain : MonoBehaviour
{
    [Header("Articulaciones del Robot")]
    public Transform shoulder;
    public Transform arm;
    public Transform hand;

    [Header("Velocidad de Animación")]
    public float rotationSpeed = 45f;

    void Update()
    {
        if (shoulder == null || arm == null || hand == null) return;

        shoulder.Rotate(0, rotationSpeed * Time.deltaTime, 0);
        arm.Rotate(rotationSpeed * 1.5f * Time.deltaTime, 0, 0);

        Matrix4x4 mShoulder = Matrix4x4.TRS(shoulder.localPosition, shoulder.localRotation, shoulder.localScale);
        Matrix4x4 mArm = Matrix4x4.TRS(arm.localPosition, arm.localRotation, arm.localScale);
        Matrix4x4 mHand = Matrix4x4.TRS(hand.localPosition, hand.localRotation, hand.localScale);

        Matrix4x4 mGlobalHand = mShoulder * mArm * mHand;

        Vector3 mathGlobalPosition = mGlobalHand.GetColumn(3);

        Vector3 unityGlobalPosition = hand.position;
        
    }

    void OnDrawGizmos()
    {
        DrawLocalAxes(shoulder);
        DrawLocalAxes(arm);
        DrawLocalAxes(hand);

        if (shoulder != null && arm != null && hand != null)
        {
            Gizmos.color = Color.white;
            Gizmos.DrawLine(shoulder.position, arm.position);
            Gizmos.DrawLine(arm.position, hand.position);
        }
    }

    private void DrawLocalAxes(Transform t)
    {
        if (t == null) return;
        
        float length = 1.5f;
        Vector3 pos = t.position;

        Gizmos.color = Color.red;
        Gizmos.DrawRay(pos, t.right * length);

        Gizmos.color = Color.green;
        Gizmos.DrawRay(pos, t.up * length);
        
        Gizmos.color = Color.blue;
        Gizmos.DrawRay(pos, t.forward * length);
    }
}