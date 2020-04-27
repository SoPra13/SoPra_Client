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

    public void SetTopicText()
    {
        mockStats.ReactSetThisRoundsTopic(mockStats.GetCurrentTopic());
    }

    public void TriggerClueP1P2()
    {
        mockStats.ReactSetPlayerHasSubmittedClue("1100001");
    }

    public void TriggerClueP3P4p6()
    {
        mockStats.ReactSetPlayerHasSubmittedClue("1111111");
    }


    public void SetClueList()
    {
        mockStats.ReactSetClueString("green;long;bites;RuleViolation;venomous;RuleViolation;RuleViolation");
    }
}

