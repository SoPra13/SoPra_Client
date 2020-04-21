using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestButton : MonoBehaviour
{
    public MockStats mockStats;

    private void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    public void ConnectPlayer()
    {
        mockStats.SetConnectedPlayers();
        //PlayerCounter.playerCount++;
    }

    public void TriggerTopicInput01()
    {
        mockStats.TESTINGsetTopicInputArray();
    }
}

