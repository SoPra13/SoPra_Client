using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Avatars : MonoBehaviour
{
    public GameObject avatar1;
    public GameObject avatar2;
    public GameObject avatar3;
    public GameObject avatar4;
    public GameObject avatar5;
    public GameObject avatar6;
    public GameObject avatar7;

    public GameObject GetAvatar(int i)
    {
        if (i == 1)
        {
            return avatar1;
        }
        if (i == 2)
        {
            return avatar2;
        }
        if (i == 3)
        {
            return avatar3;
        }
        if (i == 4)
        {
            return avatar4;
        }
        if (i == 5)
        {
            return avatar5;
        }
        if (i == 6)
        {
            return avatar6;
        }
        if (i == 7)
        {
            return avatar7;
        }
        else
        {
            return null;
        }
    }

    public Vector3 GetAvatarPos(int i)
    {
        if (i == 1)
        {
            return new Vector3(437.0f, -196.0f, 0.0f);
        }
        if (i == 2)
        {
            return new Vector3(140.0f, -270.0f, 0.0f);
        }
        if (i == 3)
        {
            return new Vector3(-169.0f, -265.0f, 0.0f);
        }
        if (i == 4)
        {
            return new Vector3(-470.0f, -157.0f, 0.0f);
        }
        if (i == 5)
        {
            return new Vector3(-287.0f, 13.0f, 0.0f);
        }
        if (i == 6)
        {
            return new Vector3(-7.0f, 49.0f, 0.0f);
        }
        if (i == 7)
        {
            return new Vector3(298.0f, 11.0f, 0.0f);
        }
        else
        {
            return new Vector3(0.0f, 0.0f, 0.0f);
        }
    }
}
