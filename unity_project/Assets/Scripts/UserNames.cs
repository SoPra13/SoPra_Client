using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UserNames : MonoBehaviour
{
    public Vector3 getNamePos(int i)
    {
        if (i == 1)
        {
            return new Vector3(436.0f, -98.0f, 0.0f);
        }
        if (i == 2)
        {
            return new Vector3(139.0f, -171.0f, 0.0f);
        }
        if (i == 3)
        {
            return new Vector3(-170.0f, -167.0f, 0.0f);
        }
        if (i == 4)
        {
            return new Vector3(-471.0f, -59.0f, 0.0f);
        }
        if (i == 5)
        {
            return new Vector3(-289.0f, 111.0f, 0.0f);
        }
        if (i == 6)
        {
            return new Vector3(-5.0f, 147.0f, 0.0f);
        }
        if (i == 7)
        {
            return new Vector3(300.0f, 110.0f, 0.0f);
        }
        else
        {
            return new Vector3(0.0f, 0.0f, 0.0f);
        }
    }
}
