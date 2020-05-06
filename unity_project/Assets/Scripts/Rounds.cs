using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using TMPro;
using System;
using UnityEngine.SceneManagement;

public class Rounds : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void FetchTopicList();

    [DllImport("__Internal")]
    private static extern void StartNextRound();

    [DllImport("__Internal")]
    private static extern void FetchRound();

    [DllImport("__Internal")]
    private static extern void SendTopicToReact(string message);

    [DllImport("__Internal")]
    private static extern void GameHasEnded(int score); //tell react that the game has ended

    [DllImport("__Internal")]
    private static extern void FetchScoreStats(); //this is called at the end of the last round and will tell react to call
    //these functions in mockstats: ReactSendCorrectGuessString(), ReactSendDuplicateString(), ReactSendValidCluesSting()



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
    private bool waitForSettingUpNextRound = false;
    private bool askingForActivePlayer = false;
    private bool waiter = false;
    private bool timeDoneCheck = false;
    private bool waitForCompletionPhase13 = false;
    private bool lockDown = false;
    private bool skippingTurn = false;


    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }


    private void Update()
    {
        if(roundPhase == 1)//Shuffling Animation of Cards AND Set the Round (fetched from Backend)
        {
            //Just for Testing
            //GameObject.Find("MultiplierText").GetComponent<TextMeshProUGUI>().text = mockStats.GetMultiplier().ToString("#.0");
            //Reset things at the beginning of each round:
            mockStats.SetStartNextRound();
            waitForSettingUpNextRound = false;
            roundPhase3Wakes = true;
            lockDown = false;
            timeDoneCheck = false;
            skippingTurn = false;
            DeactivateWater();
            mockStats.ResetTimeValues();
            GameObject.Find("ScoreNumber").GetComponent<TextMeshProUGUI>().text = GetRound().ToString();

            try { FetchRound(); }//This will tell React to get the Round int for this round
            catch (EntryPointNotFoundException e)
            {
                Debug.Log("Unity wants to set the current round but failed " + e);
            }


            gameBoard.DisplayArrow();
            if (round == 0)
            {
                StartCoroutine(gameBoard.StartTextBox(mockStats.GetName(mockStats.GetActivePlayer() - 1) + " has been chosen to be the Active " +
                                    "Player this Round! He will draw <color=#001AF6>13</color> random topic cards...", false, 1));
                StartCoroutine(Phase1Shuffle());
                roundPhase = 2;
            }
            else
            {
                StartCoroutine(gameBoard.StartTextBox(mockStats.GetName(mockStats.GetActivePlayer() - 1) + " is the new active Player for " +
                                    "this Round!", false, 1));
                StartCoroutine(WaitForArrowToDisappear());
                roundPhase = 2;
            }
        }

        if(roundPhase == 2)//Cards are being shuffeled
        {

        }

        if(roundPhase == 3 && roundPhase3Wakes)//Playerbox Flips
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                StartCoroutine(gameBoard.DrawCardActivePlayer(round));
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
                if (!waiter)
                {

                }
                else
                {
                    StartCoroutine(gameBoard.PlayersHaveChosenTheirTopic());
                    gettingTopicChoiceInfo = false;
                    roundPhase = 7;
                }

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
                //if (sum >= (mockStats.GetTotalNumberOfPlayers() - 1))
                {
                    StartCoroutine(CallForTopicList());
                    StartCoroutine(gameBoard.RemoveTopicCard()); //remove the topic card and then continue
                    mockStats.SetTime(0, timer.GetTime());
                    timer.DeactivateTimer();
                    gameBoard.ForceRemoveInfoBox();
                    topicCall = false;
                    roundPhase = 8;
                }
            }
  
        }

        if (roundPhase == 8)//I get the latest version of the topic array and animate whether there are duplicates or no votes
        {
            gettingClueInfos = false;
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                if (!phase8Running)
                {
                    StartCoroutine(gameBoard.PlayersHaveSubmittedTheirClues(true));
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
                roundPhase = 10;
            }
        }

        if(roundPhase == 10)//waits until react sends back the chosen Topic to Unity, then the function ReactSetThisRoundsTopic() from mockStats
                            //will set Round = 11
                            //OR Active Player has to input his guess
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                mockStats.GetClueStringFromReact();
                roundPhase = 11;
            }
            else
            {

            }
        }

        //Wait for Backend to send the ClueString to Active Player (mockstats.ReactSetClueString() will advance to roundPhase = 12)
        if (roundPhase == 11)
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                if (mockStats.GetBuxFix())
                {
                    roundPhase = 12;
                }
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
                mockStats.SetBuxFix();
                StartCoroutine(gameBoard.DisplayCluesFromPlayers());
                gameBoard.DisplayMisteryInputBoxActivePlayer();
                timer.StartTimer(30);
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
                if (!timer.getTimerStatus() && !timeDoneCheck && !lockDown && !skippingTurn)
                {
                    StartCoroutine(GameObject.Find("SubmitButton").GetComponent<SubmitButton>().SetMisteryWordBoxInactive(true));
                    GameObject.Find("SubmitButton").GetComponent<SubmitButton>().ActivePlayerFailedToSubmit();
                    timeDoneCheck = true;
                }
            }
            else
            {
                if (!waitForCompletionPhase13)
                {
                    gameBoard.DisplayMisteryInputBox();
                    StartCoroutine(gameBoard.PlayersEnterMisteryWord());
                    waitForCompletionPhase13 = true;
                }
            }
        }

        //Wait for player to input guess and send it
        if (roundPhase == 14)
        {
            waitForCompletionPhase13 = false;
            if (!timer.getTimerStatus() && !timeDoneCheck && !lockDown)
            {
                StartCoroutine(GameObject.Find("SubmitButton").GetComponent<SubmitButton>().SetMisteryWordBoxInactive(true));
                GameObject.Find("SubmitButton").GetComponent<SubmitButton>().PlayerFailedToSubmit();
                timeDoneCheck = true;
            }
        }

        //Player waits for other player to make their guess, this phase is set via SubmitButton.cs script
        if (roundPhase == 15)
        {
            timeDoneCheck = false;
            lockDown = false;
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
            StartCoroutine(gameBoard.PlayersHaveSubmittedTheirClues(false));
            roundPhase = 18;
        }

        //Waiting for the Active Player to make his Guess
        if (roundPhase == 18)
        {
            if (!askingForActivePlayer)
            {
                StartCoroutine(AskIfActivePlayerHasSubmittedGuess());
                askingForActivePlayer = true;
            }
            if (mockStats.GetActivePlayerSubmittedGuess() == 1) //Topic has been chosen
            {
                //Todo Start evaluation if players won or not
                StartCoroutine(gameBoard.ActivePlayerHasSubmittedHisGuess());
                mockStats.NotifyReactToEvaluateTheRound();
                roundPhase = 19;
            }
        }

        if (roundPhase == 19)
        {
            askingForActivePlayer = false;
        }


        //SUCCESSFUL ROUND
        if (roundPhase == 20)
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition()) {
                StartCoroutine(gameBoard.RemoveClues());
            }
            else
            {

            }
            StartCoroutine(gameBoard.NotifySuccessOrFail(true));
            mockStats.UpdateScoreInReact(1);
            StartCoroutine(gameBoard.ShowRoundEvaluation(true));
            mockStats.SetScoreLocally();
            mockStats.AddToWonRound();
            roundPhase = 22;
        }

        //UNSUCSESSFUL ROUND
        if(roundPhase == 21)
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                StartCoroutine(gameBoard.RemoveClues());             
            }
            else
            {

            }
            StartCoroutine(gameBoard.NotifySuccessOrFail(false));
            mockStats.UpdateScoreInReact(0);
            StartCoroutine(gameBoard.ShowRoundEvaluation(false));
            mockStats.AddToLostRound();
            mockStats.AddToLostRound();
            roundPhase = 22;
        }

        if (roundPhase == 27) //this phase triggers if the player skipped his guess
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                StartCoroutine(gameBoard.RemoveClues());
            }
            else
            {

            }
            gameBoard.ActivateskipOutcome();
            StartCoroutine(gameBoard.NotifySuccessOrFail(false));
            mockStats.UpdateScoreInReact(0);
            StartCoroutine(gameBoard.ShowRoundEvaluation(false));
            //gameBoard.TriggerMiniCard(false);
            mockStats.AddToLostRound();
            roundPhase = 22;
        }

        if (roundPhase == 22)
        {
            
        }

        //Start next Round
        if (roundPhase == 23)
        {
            StartCoroutine(gameBoard.CleanUpRound());
            roundPhase = 24;
        }

        if (roundPhase == 24)
        {

        }


        //With StartNextRound() Unity tells react to start the next round, Backend will set Round +1 or Round + 2 (if loss) and
        //then calls ReactSetRound() and ReactSetPlayerStats() in mockstats with the new value
        if (roundPhase == 25)
        {
            if (!waitForSettingUpNextRound)
            {
                try { StartNextRound(); }
                catch (EntryPointNotFoundException e)
                {
                    Debug.Log("Unity wants to tell React to start the next round but could not reach it " + e);
                }
                waitForSettingUpNextRound = true;
            }


            if (mockStats.GetStartNextRound())
            {
                //Wait for the next round to be started and check if game is over
                if (round >= 12)//EndGame
                {
                    StartCoroutine(EndGame());
                }
                //Todo Check if game is over and also check Edge case that if we are in round 12 and fail, round 13 is skipped and the game ends and
                //edge case if we are in round 13 and fail, game ends and 1 successful round is subtracted
                else
                {
                    StartCoroutine(gameBoard.NewRoundStartsAnimation());
                    roundPhase = 26;
                }
            }
        }

        if (roundPhase == 26)
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


    public void ActivateWaiter()
    {
        waiter = true;
    }

    public void DeactivateWater()
    {
        waiter = false;
    }

    //REACT calls this function to set the current round
    public void SetRound(int roundInput)
    {
        round = roundInput;
    }


    public void SetLockDown()
    {
        lockDown = true;
    }

    public void SetSkippingTurn()
    {
        skippingTurn = true;
    }


    IEnumerator Phase1Shuffle()
    {
        yield return new WaitForSeconds(4f);
        gameBoard.SetupCardStack();
        yield return new WaitForSeconds(4f);
        StartCoroutine(gameBoard.StartTextBox("The Cards have been dealt! Round 1 will start with " + mockStats.GetName(mockStats.GetActivePlayer()-1) + " as" +
            " <color=#001AF6>active player</color>!", false, 1));
        yield return new WaitForSeconds(3.5f);
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
        try { FetchTopicList(); }
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
        yield return new WaitForSeconds(2f);
        try { FetchTopicList(); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity has asked for TopicList did not succeeded " + e);
        }
        yield return new WaitForSeconds(1f);
        //Sort out duplicates
        int[] finalTopic = mockStats.GetTopicChoices();
        int max = 0;
        List<int> finalList = new List<int>();
        //int[] finalList = {0,0,0,0,0};
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
                //finalList[k] = 1;
                //finalIndex = k;
            }
        }


        //finalIndex = UnityEngine.Random.Range(0, finalList.Count - 1);
        finalIndex = 0;
        chosenTopic = gameBoard.GetCardStack()[round].GetTopics()[finalList[finalIndex]];
        mockStats.SetCurrentTopic(chosenTopic);
        yield return new WaitForSeconds(0.25f);

        try { SendTopicToReact(chosenTopic); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to send the topic string but failed " + e);
        }
        yield return new WaitForSeconds(1f);

        roundPhase = 9;
        topicCall = false;
        lastCall = false;
    }


    IEnumerator GetPlayerChoiceInfosFromReact()
    {
        mockStats.GetPlayerHaveChosenTopicFromReact();
        gameBoard.CheckTopicChoiceBubble();
        yield return new WaitForSeconds(1f);
        gettingTopicChoiceInfo = false;
    }


    //First I need to tell react I want the submitted clue list via GetSubmitedCluesFromReact();
    //Then React will call ReactSetPlayerHasSubmittedClue() in MockStats
    //Then I set up the bubbles accordingly
    IEnumerator CallForClueStatus()
    {
        mockStats.GetSubmitedCluesFromReact();
        gameBoard.CheckClueBubble();
        yield return new WaitForSeconds(0.5f);
        gettingClueInfos = false;
    }

    IEnumerator WaitForArrowToDisappear()
    {
        yield return new WaitForSeconds(2f);
        gameBoard.RemoveArrow();
        roundPhase = 3;
    }


    //Asks React if Active Player already made his choice
    IEnumerator AskIfActivePlayerHasSubmittedGuess()
    {
        mockStats.GetActivePlayerHasSubmittedGuessFromReact();
        yield return new WaitForSeconds(0.5f);
        askingForActivePlayer = false;
    }

    //Asks React if Active Player already made his choice
    IEnumerator EndGame()
    {
        try { FetchScoreStats(); }//This will tell React to get the Round int for this round
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to get data on the score stats of a player but failed " + e);
        }
        yield return new WaitForSeconds(1.5f);

        mockStats.MultiplyScore();
        yield return new WaitForSeconds(0.2f);
        //ToDo Tell React that game is finished
        try { GameHasEnded(mockStats.GetScore()); }//This will tell React to get the Round int for this round
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to tell React that the game has ended " + e);
        }
        yield return new WaitForSeconds(0.2f);
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1); 
    }

}
