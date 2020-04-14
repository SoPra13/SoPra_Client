using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class PlayerTopicInput : MonoBehaviour
{
    public MockStats mockStats;

    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    public void PressTopicButton()
    {
        //Achtung, this.name[11] ist vom Type Char, parsing mit -49 (ASCII CODE)
        mockStats.SetPlayerTopicInput(this.name[11]-49);
    }


}
