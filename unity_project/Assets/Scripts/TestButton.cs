using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestButton : MonoBehaviour
{
    public MockStats mockStats;
    private int roundTesting = 0;

    private Rounds round;

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
        mockStats.SetCurrentTopic(mockStats.GetCurrentTopic());
        mockStats.ReactSetThisRoundsTopic();
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
        mockStats.ReactSetClueString("1;2;3;4;5;6;gaggi");
    }

    public void EvaluateRound()
    {
        mockStats.ReactTellRoundWin(0);
    }

    public void AtivePlayerGuessed()
    {
        mockStats.ReactSetActivePlayerMadeGuess(1);
    }


    public void AdvanceRound()
    {
        if(roundTesting == 0)
        {
            round = GameObject.Find("Rounds").GetComponent<Rounds>();
            mockStats.ReactSetPlayerStats("4444");
            round.SetRound(2);

        }
        else if (roundTesting == 1)
        {
            round = GameObject.Find("Rounds").GetComponent<Rounds>();
            mockStats.ReactSetPlayerStats("1444");
            round.SetRound(4);

        }
        if (roundTesting == 2)
        {
            round = GameObject.Find("Rounds").GetComponent<Rounds>();
            mockStats.ReactSetPlayerStats("2444");
            round.SetRound(6);
        }
        else if (roundTesting == 3)
        {
            round = GameObject.Find("Rounds").GetComponent<Rounds>();
            mockStats.ReactSetPlayerStats("3444");
            round.SetRound(8);
        }
        else if (roundTesting == 4)
        {
            round = GameObject.Find("Rounds").GetComponent<Rounds>();
            mockStats.ReactSetPlayerStats("4444");
            round.SetRound(10);
        }

        mockStats.ReactSetPlayerHasSubmittedClue("0000000");
        mockStats.ReactSetPlayerHasChosenTopic("0000000");
        mockStats.ReactSetTopicVoteList("00000");
        mockStats.ReactSetActivePlayerMadeGuess(0);
        mockStats.ReactStartNextRound();
        roundTesting += 1;
    }
}

