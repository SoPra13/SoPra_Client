using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using TMPro;
using System;

public class Rounds : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void CallsForTopicList();

    [DllImport("__Internal")]
    private static extern void TopicsHaveBeenChosen();

    [DllImport("__Internal")]
    private static extern void AskForRound();

    [DllImport("__Internal")]
    private static extern void SendTopicStringToReact(string message);

    /*[DllImport("__Internal")]
    private static extern void CallsForClueReady();*/



    public GameBoard gameBoard;
    public Positions positions;
    public MockStats mockStats;
    public Timer timer;

    //public AudioSource clockTick;
    //public AudioSource timeOver;

    private int round = 0; //keeps track of the round number, starts with 0, ends after 12
    private int roundPhase;
    private bool roundPhase3Wakes = true;
    private bool topicCall = false;
    private bool lastCall = false;
    private bool gettingTopicChoiceInfo = false;
    //private bool CallsRunning = false;
    private int finalIndex;
    private bool gettingClueInfos = false;
    private bool phase8Running = false;


    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }


    private void Update()
    {
        Debug.Log(roundPhase);
        if(roundPhase == 1)//Shuffling Animation of Cards AND Set the Round (fetched from Backend)
        {
            try { AskForRound(); }//This will tell React to get the Round int for this round
            catch (EntryPointNotFoundException e)
            {
                Debug.Log("Unity wants to set the current round but failed " + e);
            }

            StartCoroutine(gameBoard.DisplayInfoText(mockStats.GetName(mockStats.GetActivePlayer()-1) + " has been chosen to be the Active " +
                                                "Player this Round! He will draw <color=#001AF6>13</color> random topic cards...", false, 1));
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
                roundPhase = 5;
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

        if (roundPhase == 5)//Waits for Topiccard to be displayed OR Active Player waits for Topics being chosen
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                if (!gettingTopicChoiceInfo)
                {
                    //I have to get the topic array from React and adjust the thinking bubbles in the game accordingly
                    //if a player has made his choice, a thick should appear in his box
                    StartCoroutine(GetPlayerChoiceInfosFromReact());
                    gettingTopicChoiceInfo = true;
                }
            }
            else
            {

            }
        }

        if (roundPhase == 6)//Timer Starts
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                StartCoroutine(gameBoard.PlayersHaveChosenTheirTopic());
                gettingTopicChoiceInfo = false;
                roundPhase = 7;
            }
            else
            {
                timer.StartTimer(30);
                roundPhase = 7;
            }
        }

        if (roundPhase == 7)// Non-Active Players have 30 seconds to pick a Topic OR Active Player waits for Clues to be given
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                if (!gettingClueInfos)
                {
                    //I have to get the topic array from React and adjust the thinking bubbles in the game accordingly
                    //if a player has submitted his clue, a thick should appear in his box
                    StartCoroutine(CallForClueStatus());
                    gettingClueInfos = true;
                }

                int sum = 0;
                for (int i = 0; i < mockStats.GetTotalNumberOfPlayers(); i++)
                {
                    if (i == mockStats.GetActivePlayer() - 1)
                    {

                    }
                    else
                    {
                        sum += mockStats.GetCluesSubmitted()[i];
                    }
                }

                if (sum == mockStats.GetTotalNumberOfPlayers() - 1)
                {
                    StartCoroutine(CallForClueStatus());
                    roundPhase = 8; //ALL PLAYERS HAVE GIVEN THEIR CLUE
                }
            }
            else
            {

                if (!topicCall)
                {
                    StartCoroutine(CallForTopicList());
                    topicCall = true;
                }

                //every player has made his choice conditon
                int sum = 0;
                for (int j = 0; j < 5; j++)
                {
                    sum += mockStats.GetTopicChoices()[j];
                }
                //Everyone has set their vote
                //Check for draws
                if (sum >= (mockStats.GetTotalNumberOfPlayers() - 1) || !timer.getTimerStatus())
                {
                    StartCoroutine(gameBoard.RemoveTopicCard()); //remove the topic card and then continue
                    timer.DeactivateTimer();
                    gameBoard.ForceRemoveInfoBox();
                    topicCall = false;
                    roundPhase = 8;
                }
            }
  
        }

        if (roundPhase == 8)//I get the latest version of the topic array and animate whether there are duplicates or no votes
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                if (!phase8Running)
                {
                    StartCoroutine(gameBoard.PlayersHaveSubmittedTheirClues());
                    phase8Running = true;
                }
            }
            else
            {
                if (!lastCall)
                {
                    StartCoroutine(LastCallForTopics());
                    lastCall = true;
                }
            }
        }

        if (roundPhase == 9)
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                phase8Running = false;
                roundPhase = 10;
            }
            else
            {

                //Unity will now trigger the topicsHaveBeenChosen() function in React
                //This function will tell react to get the final topic in the backend
                //The backend will take the current topic Array and check if there are duplicates or if all is empty
                //If there are duplicates: Backend will randomly choose one of the duplicates
                //if there are no votes, backend will randomly return of the topic to react
                //React will then set this Rounds Topic in the MockStats Object by calling ReactSetThisRoundsTopic(int string)
                try { TopicsHaveBeenChosen(); }//This will tell React to get the Topic Array from the Backend and send it to unity
                catch (EntryPointNotFoundException e)
                {
                    Debug.Log("Unity wants to let React know that all topics have been chosen. This failed " + e);
                }

                roundPhase = 10;
            }
        }

        if(roundPhase == 10)//waits until react sends back the chosen Topic to Unity, then the function ReactSetThisRoundsTopic() from mockStats will set Round = 11
        //OR Active Player has to input his guess
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                gameBoard.DisplayMisteryInputBoxActivePlayer();
                mockStats.GetClueStringFromReact();
                roundPhase = 11;
            }
            else
            {
                //REMOVE AFTERWARDS
                //Just for testing
                //mockStats.ReactSetThisRoundsTopic(mockStats.GetCurrentTopic());
                //Testing Ends
            }
        }

        //Wait for Backend to send the ClueString to Active Player (mockstats.ReactSetClueString() will advance to rounPhase = 12)
        if (roundPhase == 11)
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {

            }
            else
            {
                StartCoroutine(gameBoard.ShowThisRoundsTopic());
                roundPhase = 12;
            }
        }

        if (roundPhase == 12)//Wait until Topic Animation is over in GameBoard OR Active Player displays the other players clues
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                StartCoroutine(gameBoard.DisplayCluesFromPlayers());
                roundPhase = 13;
            }
            else
            {

            }
        }

        if (roundPhase == 13)//Show Player Input Panel OR Active Player has to input his guess
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {

            }
            else
            {
                gameBoard.DisplayMisteryInputBox();
                StartCoroutine(gameBoard.PlayersEnterMisteryWord());
                roundPhase = 14;
            }

        }

        //Wait for player to input guess and send it
        if (roundPhase == 14)
        {

        }

        //Player waits for other player to make their guess, this phase is set via SubmitButton.cs script
        if (roundPhase == 15)
        {
            StartCoroutine(gameBoard.PlayersWaitForOthersToSubmitClue());
            roundPhase = 16;
        }

        if (roundPhase == 16)
        {
            if (!gettingClueInfos)
            {
                StartCoroutine(CallForClueStatus());
                gettingClueInfos = true;
            }

            int sum = 0;
            for (int i = 0; i < mockStats.GetTotalNumberOfPlayers(); i++)
            {
                if(i == mockStats.GetActivePlayer() - 1)
                {

                }
                else
                {
                    sum += mockStats.GetCluesSubmitted()[i];
                }
            }

            if (sum == mockStats.GetTotalNumberOfPlayers() - 1)
            {
                StartCoroutine(CallForClueStatus());
                roundPhase = 17; //ALL PLAYERS HAVE GIVEN THEIR CLUE
            }
        }


        //Clean up SubmitWindow and continue to PlayersWaitForActivePlayer to commit Guess
        if (roundPhase == 17)
        {
            //roundPhase = 18;
        }


        if (roundPhase == 18)
        {
            
        }

        //SUCCESSFUL ROUND
        if(roundPhase == 20)
        {
            mockStats.UpdateScoreInReact(1);
            StartCoroutine(gameBoard.ShowRoundEvaluation(true));
            roundPhase = 22;
        }

        //UNSUCSESSFUL ROUND
        if(roundPhase == 21)
        {
            mockStats.UpdateScoreInReact(0);
            StartCoroutine(gameBoard.ShowRoundEvaluation(false));
            roundPhase = 22;
        }

        if (roundPhase == 22)
        {
            Debug.Log("reset everything for next round");
        }

        //Start next Round
        if (roundPhase == 23)
        {
            
        }
    }


    public void StartRound()
    {
        roundPhase = 1;
    }


    public void DisplaySameVoteMessage()
    {
        StartCoroutine( Round1VoteConflict());
    }


    public void SetRoundPhase(int phase)
    {
        roundPhase = phase;
    }


    public int GetRound()
    {
        return round;
    }


    public void SetRound(int roundInput)
    {
        round = roundInput;
    }


    //This is called via the MockStats Script. The Mock gets this info from React
    /*public void SetTopics(int[] topicsFromBackend)
    {
        topics = topicsFromBackend;
    }*/


    IEnumerator Phase1Shuffle()
    {
        yield return new WaitForSeconds(4f);
        gameBoard.SetupCardStack();
        yield return new WaitForSeconds(4f);
        StartCoroutine(gameBoard.DisplayInfoText("The Cards have been dealt! Round 1 will start with " + mockStats.GetName(mockStats.GetActivePlayer()-1) + " as" +
            " <color=#001AF6>active player</color>!", false, 1));
        yield return new WaitForSeconds(3f);
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


    //This will tell React to get the Topic Array from the Backend and send it to unity, triggers every 0.5 seconds
    IEnumerator CallForTopicList()
    {
        try { CallsForTopicList(); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity has asked for TopicList did not succeeded " + e);
        }
        yield return new WaitForSeconds(0.5f);

        for (int i = 1; i <= 5; i++)
        {
            GameObject.Find("TopicVoteNumber" + i.ToString()).GetComponent<TextMeshProUGUI>().text = mockStats.GetTopicChoices()[i-1].ToString();
        }
        topicCall = false;
    }



    IEnumerator LastCallForTopics()
    {
        try { CallsForTopicList(); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity has asked for TopicList did not succeeded " + e);
        }

        //Sort out duplicates
        int[] finalTopic = mockStats.GetTopicChoices();
        int max = 0;
        List<int> finalList = new List<int>();
        string chosenTopic;

        //Get max value of topic votes
        for (int i = 0; i < 5; i++)
        {
            if (finalTopic[i] >= max)
            {
                max = finalTopic[i];
            }
        }

        for (int k = 0; k < 5; k++)
        {
            if(finalTopic[k] == max)
            {
                finalList.Add(k);
            }
        }
        finalIndex = UnityEngine.Random.Range(0, finalList.Count - 1);
        chosenTopic = gameBoard.GetCardStack()[round].GetTopics()[finalList[finalIndex]];

        try { SendTopicStringToReact(chosenTopic); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to send the topic string but failed " + e);
        }

        yield return new WaitForSeconds(0.5f);
        roundPhase = 9;
        lastCall = false;
        topicCall = false;
    }


    IEnumerator GetPlayerChoiceInfosFromReact()
    {
        mockStats.GetPlayerHaveChosenTopicFromReact();
        gameBoard.CheckTopicChoiceBubble();
        yield return new WaitForSeconds(1f);
        gettingTopicChoiceInfo = false;
    }


    //First I need to tell react I want the submitted clue lsit via GetSubmitedCluesFromReact();
    //Then React will call ReactSetPlayerHasSubmittedClue() in MockStats
    //Then I set up the bubbles accordingly
    IEnumerator CallForClueStatus()
    {
        mockStats.GetSubmitedCluesFromReact();
        gameBoard.CheckClueBubble();
        yield return new WaitForSeconds(0.5f);
        gettingClueInfos = false;
    }  
}
