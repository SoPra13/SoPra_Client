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


    public void TriggerTopicChoiceP1P3P4()
    {
        mockStats.PlayerHasChosenTopic(0);
        mockStats.PlayerHasChosenTopic(2);
        mockStats.PlayerHasChosenTopic(3);
    }

    public void TriggerTopicChoiceP2P5P6()
    {
        mockStats.PlayerHasChosenTopic(1);
        mockStats.PlayerHasChosenTopic(4);
        mockStats.PlayerHasChosenTopic(5);
    }
}

