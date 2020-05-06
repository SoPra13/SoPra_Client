using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UX_Multiplier : MonoBehaviour
{
    public GameObject roundInfoBox;
    private MockStats mockStats;


    private bool isOver = false;

    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    void OnMouseOver()
    {
        if (!isOver)
        {
            GameObject multiplierInfo = Instantiate(roundInfoBox, new Vector3(-564f, -200f, 0), Quaternion.identity) as GameObject;
            multiplierInfo.name = "MultiplierInfo";
            multiplierInfo.transform.SetParent(GameObject.Find("Interaction").transform, false);
            isOver = true;
        }
    }

    void OnMouseExit()
    {
        Destroy(GameObject.Find("MultiplierInfo"));
        isOver = false;
    }
}
