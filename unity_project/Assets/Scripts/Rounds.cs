using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using TMPro;
using System;

public class Rounds : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void AskForTopicsList();



    public GameBoard gameBoard;
    public Positions positions;
    public MockStats mockStats;
    public Timer timer;

    //public AudioSource clockTick;
    //public AudioSource timeOver;

    private int round = 0; //keeps track of the round number, starts with 0, ends after 12
    private int roundPhase;
    private int[] topics;
    private bool roundPhase3Wakes = true;
    private bool topicCall = false;


    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }


    private void Update()
    {
        if(roundPhase == 1)//Shuffling Animation of Cards
        {
            StartCoroutine(gameBoard.DisplayInfoText(mockStats.GetName(mockStats.GetActivePlayer()-1) + " has been chosen to be the Active " +
                                                "Player this Round! He will draw <color=#001AF6>13</color> random topic cards...", false));
            gameBoard.DisplayArrow();
            StartCoroutine(Phase1Shuffle());
            roundPhase = 2;
        }

        if(roundPhase == 2)//Cards are being shuffeled
        {

        }

        if(roundPhase == 3 && roundPhase3Wakes)//Playerbox Flips
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                StartCoroutine(gameBoard.ActivePlayerWaitsForTopics());
            }
            else
            {
                StartCoroutine(gameBoard.AnimateFlipBox(mockStats.GetActivePlayer()));
            }
            roundPhase3Wakes = false;
        }

        if(roundPhase == 4)//Topic Card appears
        {
            StartCoroutine(RoundPhase4DrawCard());
            roundPhase = 5;
        }

        if (roundPhase == 5)//Waits for Topiccard to be displayed
        {

        }

        if (roundPhase == 6)//Timer Starts
        {
            timer.StartTimer(30);
            roundPhase = 7;
        }

        if (roundPhase == 7)// Non-Active Players have 30 seconds to pick a Topic
        {
            mockStats.GetTopicInput();

            if (!topicCall)
            {
                StartCoroutine(CallsForTopicList());
                topicCall = true;
            }

            for (int i = 1 ; i <= 5; i++)
            {
                GameObject.Find("TopicVoteNumber" + i.ToString()).GetComponent<TextMeshProUGUI>().text = topics[i - 1].ToString();
            }

            //every player has made his choice conditon
            int sum = 0;
            for (int j = 0; j < 5; j++)
            {
                sum += topics[j];
            }
            //Everyone has set their vote
            //Check for draws
            if (sum >= (mockStats.GetTotalNumberOfPlayers() - 1))
            {
                mockStats.UnlockInputForTopics();
                StartCoroutine(gameBoard.RemoveTopicCard()); //remove the topic card and then continue
                timer.DeactivateTimer();
                gameBoard.ForceRemoveInfoBox();
                roundPhase = 8;
            }
        }

        if (roundPhase == 8)//Evaluate Topic Choice Results
        {
            //Until here, the active Player was waiting, make sure to not forget about him
        }

    }


    public void StartRound()
    {
        roundPhase = 1;
    }


    public void DisplaySameVoteMessage()
    {
        StartCoroutine(Round1VoteConflict());
    }


    public void SetRoundPhase(int phase)
    {
        roundPhase = phase;
    }


    //This is called via the MockStats Script. The Mock gets this info from React
    public void SetTopics(int[] topicsFromBackend)
    {
        topics = topicsFromBackend;
    }


    IEnumerator Phase1Shuffle()
    {
        yield return new WaitForSeconds(4f);
        gameBoard.SetupCardStack();
        yield return new WaitForSeconds(4f);
        StartCoroutine(gameBoard.DisplayInfoText("The Cards have been dealt! Round 1 will start with " + mockStats.GetName(mockStats.GetActivePlayer()-1) + " as" +
            " <color=#001AF6>active player</color>!", false));
        yield return new WaitForSeconds(2f);
        gameBoard.RemoveArrow();
        roundPhase = 3;
    }


    IEnumerator RoundPhase4DrawCard()
    {
        yield return new WaitForSeconds(0.1f);

        //Scenario for non-active Player and Active Player
        if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
        {
            //TODO active player
        }
        else
        {
            StartCoroutine(gameBoard.DrawCardCoroutine(round));
        }
    }

    IEnumerator Round1VoteConflict()
    {
        /*infoTextAnimator.SetBool("wake", false);
        yield return new WaitForSeconds(0.75f);
        notification.Play();
        tmproInfoText.text = "The Cards have been dealt! Round 1 will start with " + mockStats.GetName(mockStats.GetActivePlayer()) + " as <color=#001AF6>active player</color>!";
        infoTextAnimator.SetBool("wake", true);*/
        yield return new WaitForSeconds(2f);
    }


    IEnumerator CallsForTopicList()
    {
        try { CallsForTopicList(); }//This will tell React to get the Topic Array from the Backend and send it to unity
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity has asked for TopicList did not succeeded " + e);
        }
        yield return new WaitForSeconds(1f);
        topicCall = false;
    }


    //React will call this Function to pass the current Topic Array to Unity
    //Attention, no NULL values, use 0 as empty value
    public void ReactSetTopicArray(string topicArray)
    {
        for (int i = 0; i < 5; i++)
        {
            topics[i] = (int)Char.GetNumericValue(topicArray[i]);
        }
    }
}
