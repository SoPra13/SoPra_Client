using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using System.Linq;
using System;


public class GameBoard : MonoBehaviour
{
    [SerializeField] private PlayerManagement playerHandler;

    public GameObject playerBox;
    public GameObject otherPlayers;
    public GameObject cardIso;
    public GameObject cardFlat;
    public GameObject timerObject;
    public GameObject arrowObject;
    public GameObject topicButtonObject;
    public GameObject blackScreenObject;
    public GameObject dust;
    public GameObject infoBar;
    public GameObject infoBarText;
    public GameObject topicBarObject;
    public GameObject thinkingBubbleObject;
    public GameObject infoTagObject;
    public GameObject loadingTagObject;
    public GameObject misteryWordInputContainer;
    public GameObject ruleBoxContainer;
    public GameObject clueContainer;
    public GameObject successParticleMachine;
    public GameObject thanhPilotObject;
    public GameObject scoreBoardContainer;
    public GameObject miniCardObject;
    public GameObject skipButtonObject;
    public GameObject skipTextObject;
    public GameObject cluesBG;
    public GameObject ScoreMultiplierBox;

    public Positions positions;

    public Timer timer;

    public AudioSource drawCard;
    public AudioSource spinBubble;
    public AudioSource lockSound;
    public AudioSource notification;
    public AudioSource buttonSFX;
    public AudioSource gameMusic;
    public AudioSource barCheckSFX;
    public AudioSource barAppearsSFX;
    public AudioSource dingSFX;
    public AudioSource applausSFX;
    public AudioSource failSFX;
    public AudioSource butterflyBGM;

    public Rounds round;

    public TextMeshProUGUI userName;
    public TextMeshProUGUI cardLeftText;

    //private Animator dustAnimator;
    private Card[] cardStack;
    private MockStats mockStats;
    private Avatars avatars;
    private UserNames nameClass;
    private int roundState = 1;
    private Animator infoBarAnimator;
    private Animator infoTextAnimator;
    private TextMeshProUGUI tmproInfoText;
    private int[] topics;
    private int dustSeries = 0;
    private GameObject misteryWordContainer;
    private GameObject rulesBox;
    private GameObject successParticles;
    private GameObject scoreBoard;
    private GameObject skipButton;
    private GameObject skipText;
    private GameObject scoreMultiplier;

    private bool advanceToState3 = false;
    private bool waitForServerTopicResponse = false;
    private bool serverRespondedToTopic = false;
    private bool timerPhase1Ended = false;
    private bool startGame = true;
    private bool keepInfoTextIdle = false;
    private bool Phase5HasLoaded = false;
    private bool Phase16HasLoaded = false;
    private bool skipOutcomeText = false;
    private bool waitForSetUp = false;
    private bool deactivatePlayerInfoBox = false;

    private Coroutine textBox;

    void Start()
    {
        gameMusic.volume = 0.5f;
        SetUpInitialBoard();
        StartCoroutine(FadeInScreen());
        StartCoroutine(GameStarts());
    }


    private void SetUpInitialBoard()
    {
        successParticles = Instantiate(successParticleMachine, new Vector3(0, -380, -29), Quaternion.Euler(-90,0,0)) as GameObject;
        successParticles.name = "SuccessParticles";
        successParticles.transform.SetParent(GameObject.Find("Canvas").transform, false);
        successParticles.SetActive(false);

        cardStack = new Card[13];
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
        avatars = GameObject.Find("Canvas").GetComponent<Avatars>();
        nameClass = GameObject.Find("Canvas").GetComponent<UserNames>();
        playerHandler = GameObject.FindWithTag("PlayerTotal").GetComponent<PlayerManagement>();
        playerHandler.UpdatePlayers();

        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (mockStats.GetPlayerPosition() == i)
            {
                playerHandler.GetCorrectPlayerObject(i).GetPlayerName();
                GameObject mainBox = Instantiate(playerBox, playerHandler.GetCorrectPlayerObject(i).GetPos(), Quaternion.identity) as GameObject;
                mainBox.name = "Player" + i + "Box";
                GameObject.Find("NameTag").name = "NameTagPlayer" + i;
                GameObject.Find("PlayerName").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i - 1);
                GameObject.Find("PlayerName").name = "Player" + i + "Name";
                GameObject.Find("ThinkingBubble").name = "ThinkingBubble" + i;
                mainBox.transform.SetParent(GameObject.Find("Canvas").transform, false);
                if (i >= 5)
                {
                    GameObject.Find("Player" + i + "Box").GetComponent<Animator>().SetBool("top", true);
                }
            }
            else
            {
                playerHandler.GetCorrectPlayerObject(i).GetPlayerName();
                GameObject box = Instantiate(otherPlayers, playerHandler.GetCorrectPlayerObject(i).GetPos(), Quaternion.identity) as GameObject;
                box.name = "Player" + i + "Box";
                GameObject.Find("NameTag").name = "NameTagPlayer" + i;
                GameObject.Find("ThinkingBubble").name = "ThinkingBubble" + i;
                GameObject.Find("PlayerName").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i - 1);
                GameObject.Find("PlayerName").name = "Player" + i + "Name";
                box.transform.SetParent(GameObject.Find("Canvas").transform, false);
                if (i >= 5)
                {
                    GameObject.Find("Player" + i + "Box").GetComponent<Animator>().SetBool("top", true);
                }
            }

            GameObject avatar = Instantiate(avatars.GetAvatar(playerHandler.GetCorrectPlayerObject(i).GetAvatar()), avatars.GetAvatarPos(i), Quaternion.identity) as GameObject;
            avatar.name = "Player" + i + "Avatar";
            avatar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        }
        GameObject timer = Instantiate(timerObject, new Vector3(383.5f, 259.7f, 0), Quaternion.identity) as GameObject;
        timer.name = "Timer";
        timer.transform.SetParent(GameObject.Find("Canvas").transform, false);
        timer.SetActive(false);

        StartCoroutine(SetUpScoreBoard());
    }


    public void SetupCardStack()
    {
        StartCoroutine(ShuffleCards());
    }


    //this List needs to contain 65 word (5 x 13). Word 0 - 4 is for card 1, word 5 - 9 for card 2 etc
    //This List is a REACT INPUT
    public void SetCardText(string[] cardText)
    {
        int v = 0;

        for (int i = 0; i < cardStack.Length; i++)
        {
            int count = 0;
            string[] sub = new string[5];
            for (int k = v; k < v + 5; k++)
            {
                sub[count] = cardText[k];
                count++;
            }
            cardStack[i].SetTopics(sub);
            v += 5;
        }
    }


    public void TriggerMiniCard(bool success)
    {
        //GameObject.Find("ScoreNumber").GetComponent<TextMeshProUGUI>().text = mockStats.GetScore().ToString();
        //GameObject.Find("ScoreNumber").GetComponent<TextMeshProUGUI>().text = round.GetRound().ToString();
        if (round.GetRound() == 12)
        {
            GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("success", success);
            GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("transition", true);
            GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("success", success);
            GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("transition", true);

        }
        else if (round.GetRound() > 12)
        {

        }
        else
        {
            if (success)
            {
                GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("success", success);
                GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("transition", true);
                GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("success", success);
                GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("transition", true);

            }
            else
            {
                if (skipOutcomeText)
                {
                    GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("success", success);
                    GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("transition", true);
                    GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("success", success);
                    GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("transition", true);
                }
                else
                {
                    GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("success", success);
                    GameObject.Find("MiniCard" + (round.GetRound() + 1).ToString()).GetComponent<Animator>().SetBool("transition", true);
                    GameObject.Find("MiniCard" + (round.GetRound() + 2).ToString()).GetComponent<Animator>().SetBool("success", success);
                    GameObject.Find("MiniCard" + (round.GetRound() + 2).ToString()).GetComponent<Animator>().SetBool("transition", true);
                    GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("success", success);
                    GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("transition", true);
                }
            }
        }
        mockStats.CalculateMultiplier();
        if(mockStats.GetMultiplier() <= 0.0)
        {

        }
        else
        {
            GameObject.Find("MultiplierText").GetComponent<TextMeshProUGUI>().text = mockStats.GetMultiplier().ToString("#.0");
        }    
        StartCoroutine(ResetScoreBoardAni());
    }


    public void DisplayArrow()
    {
        GameObject arrow = Instantiate(arrowObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        arrow.name = "Arrow";
        arrow.transform.SetParent(GameObject.Find("Player" + mockStats.GetActivePlayer() + "Box").transform, false);
    }


    public void RemoveArrow()
    {
        Destroy(GameObject.Find("Arrow"));
    }


    public void DrawCard(int roundNr)
    {
        StartCoroutine(DrawCardCoroutine(roundNr));
    }


    public void SetTimerPhase1()
    {
        timerPhase1Ended = true;
    }


    public void ForceRemoveInfoBox()
    {
        keepInfoTextIdle = false;
    }


    public void PlayButtonSFX()
    {
        buttonSFX.Play();
    }


    public void ActivateskipOutcome()
    {
        skipOutcomeText = true;
    }


    public bool CheckIfVotePhase()
    {
        return deactivatePlayerInfoBox;
    }

    public void DeactivatePlayerBoxBlocke()
    {
        deactivatePlayerInfoBox = false;
    }

    public void DeativateskipOutcome()
    {
        skipOutcomeText = false;
    }

    public bool GetStatusOnWakeUp()
    {
        return waitForSetUp;
    }

    public void DisplayMisteryInputBox()
    {
        deactivatePlayerInfoBox = true;
        rulesBox = Instantiate(ruleBoxContainer, new Vector3(0, -220f, 0), Quaternion.identity) as GameObject;
        rulesBox.name = "Rules";
        rulesBox.transform.SetParent(GameObject.Find("Interaction").transform, false);

        misteryWordContainer = Instantiate(misteryWordInputContainer, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        misteryWordContainer.name = "MisteryWordInput";
        misteryWordContainer.transform.SetParent(GameObject.Find("Interaction").transform, false);
        GameObject.Find("TopicTextReminder").GetComponent<TextMeshProUGUI>().text = mockStats.GetCurrentTopic();
    }


    public void DisplayMisteryInputBoxActivePlayer()
    {
        waitForSetUp = false;
        misteryWordContainer = Instantiate(misteryWordInputContainer, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        misteryWordContainer.name = "MisteryWordInput";
        misteryWordContainer.transform.SetParent(GameObject.Find("Interaction").transform, false);

        skipButton = Instantiate(skipButtonObject, new Vector3(-210, -87, 0), Quaternion.identity) as GameObject;
        skipButton.name = "SkipButton";
        skipButton.transform.SetParent(GameObject.Find("Interaction").transform, false);

        GameObject.Find("TopicTextReminder").GetComponent<TextMeshProUGUI>().text = "Guess the correct Mistery Word!";
        GameObject.Find("TopicTextReminder").GetComponent<TextMeshProUGUI>().fontSize = 28;
        GameObject.Find("topicStaleText").GetComponent<TextMeshProUGUI>().text = "Guess";
        GameObject.Find("Placeholder").GetComponent<TextMeshProUGUI>().text = "Enter your guess here...";
    }


    public Card[] GetCardStack()
    {
        return cardStack;
    }


    public void CheckTopicChoiceBubble()
    {
        for(int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if(i == mockStats.GetActivePlayer())
            {

            }
            else
            {
                if (mockStats.GetTopicChoiceMade()[i-1] == 1 && GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().GetBool("finished") == false)
                {
                    dingSFX.Play();
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("finished", true);
                }
            }
        }
        if (Phase5HasLoaded)
        {
            int sum = 0;
            for (int i = 0; i < mockStats.GetTotalNumberOfPlayers(); i++)
            {
                sum += mockStats.GetTopicChoiceMade()[i];
            }
            if (sum == mockStats.GetTotalNumberOfPlayers() - 1)
            {
                StartCoroutine(WaitShortly());
                round.SetRoundPhase(6);
                Phase5HasLoaded = false;
            }
        }

    }


    //this is for the inactive players to see who has already submitted a clue word
    public void CheckClueBubble()
    {
        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (i == mockStats.GetActivePlayer() || i == mockStats.GetPlayerPosition())
            {

            }
            else
            {
                if (mockStats.GetCluesSubmitted()[i - 1] == 1 && GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().GetBool("finished") == false)
                {
                    dingSFX.Play();
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("finished", true);
                }
            }
        }

        if (Phase16HasLoaded)
        {
            int sum = 0;
            for (int i = 0; i < mockStats.GetTotalNumberOfPlayers(); i++)
            {
                sum += mockStats.GetCluesSubmitted()[i];
            }
            if (sum == mockStats.GetTotalNumberOfPlayers() - 1)
            {
                //round.SetRoundPhase(6);
                Phase16HasLoaded = false;
            }
        }
    }

    public IEnumerator ShowThisRoundsTopic()
    {
        waitForSetUp = false;
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1.0f);
        GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicBar.name = "TopicBar";
        topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        barAppearsSFX.Play();
        GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", true);
        GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = mockStats.GetCurrentTopic();
        yield return new WaitForSeconds(1.0f);
        barCheckSFX.Play();
        yield return new WaitForSeconds(3.2f);
        round.SetRoundPhase(13);
        waitForSetUp = true;
        Destroy(GameObject.Find("TopicBar"));
        Destroy(GameObject.Find("BlackScreen"));
    }

    public IEnumerator NotifyPlayerThatTopicHasBeenChosen()
    {
        waitForSetUp = false;
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1.0f);
        GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicBar.name = "TopicBar";
        topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        barAppearsSFX.Play();
        GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", true);
        GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "Your Team has chosen...";
        GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...a Topic for this Round!";
        yield return new WaitForSeconds(1.0f);
        barCheckSFX.Play();
        yield return new WaitForSeconds(3.2f);
        waitForSetUp = true;
        Destroy(GameObject.Find("TopicBar"));
        Destroy(GameObject.Find("BlackScreen"));
    }


    public IEnumerator NotifyPlayerhaveSubmittedTheirClue()
    {
        waitForSetUp = false;
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1.0f);
        GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicBar.name = "TopicBar";
        topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        barAppearsSFX.Play();
        GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", true);
        GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "Your Team has submitted...";
        GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...their clues!";
        yield return new WaitForSeconds(1.0f);
        barCheckSFX.Play();
        yield return new WaitForSeconds(3.2f);
        waitForSetUp = true;
        Destroy(GameObject.Find("TopicBar"));
        Destroy(GameObject.Find("BlackScreen"));
    }


    public IEnumerator NotifySuccessOrFail(bool success)
    {
        waitForSetUp = false;
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1.0f);
        GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicBar.name = "TopicBar";
        topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        barAppearsSFX.Play();
        if (success)
        {
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", true);
                GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "Your guess was...";
                GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...correct!";
            }
            else
            {
                GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", true);
                GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(mockStats.GetActivePlayer() - 1) + " has guessed...";
                GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...correctly! Well done";
            }
            
        }
        else if (!success)
        {
            if (!skipOutcomeText)
            {
                if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
                {
                    GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", false);
                    GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "Your guess was...";
                    GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...incorrect!";
                }
                else
                {
                    GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", false);
                    GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(mockStats.GetActivePlayer() - 1) + " has guessed...";
                    GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...wrong! Better luck next time...";
                }
            }
            else
            {
                if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
                {
                    GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", false);
                    GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "You decided to...";
                    GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...skip this turn!";
                }
                else
                {
                    GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", false);
                    GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(mockStats.GetActivePlayer() - 1) + " has decided...";
                    GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...to skip this turn...";
                }
            }                    
        }
        yield return new WaitForSeconds(1.0f);
        barCheckSFX.Play();
        yield return new WaitForSeconds(3.2f);
        if (success)
        {
            TriggerMiniCard(true);
        }
        else
        {
            TriggerMiniCard(false);
        }

        waitForSetUp = true;
        DeativateskipOutcome();
        Destroy(GameObject.Find("TopicBar"));
        Destroy(GameObject.Find("BlackScreen"));
    }


    IEnumerator GameStarts()
    {
        yield return new WaitForSeconds(4f);
        waitForSetUp = true;
        round.StartRound();
    }


    IEnumerator ShuffleCards()
    {
        //Setup Card Stack of 13 Cards in the Middle
        //Here I need to fetch the topics from the Backend (1 Card has 5 Topics)
        float x = -14;
        float y = -124;
        for (int i = 0; i < 13; i++)
        {
            drawCard.Play();
            string cardName = "Card" + i;
            GameObject card = Instantiate(cardIso, new Vector3(x, y, 0f), Quaternion.identity);
            card.transform.SetParent(GameObject.Find("Canvas").transform, false);
            card.name = cardName;
            cardStack[i] = card.GetComponent<Card>();
            //x += 0;
            y += 4;
            yield return new WaitForSeconds(0.2f);
        }
        yield return new WaitForSeconds(0.5f);
        //Set up the number of Cards left
        TextMeshProUGUI cardsLeftText = Instantiate(cardLeftText, positions.GetCardLeftTextPosition(), Quaternion.identity);
        cardsLeftText.name = "CardsLeftText";
        cardsLeftText.transform.SetParent(GameObject.Find("Canvas").transform, false);
        SetCardText(mockStats.GetTopicArray());
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(0.2f);
    }


    public IEnumerator DrawCardCoroutine(int roundNr)
    {
        if (mockStats.GetLastRoundOutcome()) //Last Round was lost
        {
            GameObject.Find("Card" + (12 - roundNr + 1).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
            drawCard.Play();
            yield return new WaitForSeconds(0.5f);


            GameObject.Find("Card" + (12 - roundNr).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
            drawCard.Play();
            if(roundNr >= 12)
            {
                Destroy(GameObject.Find("CardsLeftText"));
            }
            else
            {
                GameObject.Find("CardsLeftText").GetComponent<TextMeshProUGUI>().text = "< " + (12 - roundNr).ToString() + " Left >";
                GameObject.Find("CardsLeftText").transform.localPosition = positions.DecreaseCardLeftTextPositionLoss();
            }
            yield return new WaitForSeconds(0.5f);
            Destroy(GameObject.Find("Card" + (12 - roundNr).ToString()));
            Destroy(GameObject.Find("Card" + (12 - roundNr + 1).ToString()));
        }
        else
        {
            GameObject.Find("Card" + (12 - roundNr).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
            drawCard.Play();
            GameObject.Find("CardsLeftText").GetComponent<TextMeshProUGUI>().text = "< " + (12 - roundNr).ToString() + " Left >";
            yield return new WaitForSeconds(0.5f);
            GameObject.Find("CardsLeftText").transform.localPosition = positions.DecreaseCardLeftTextPosition();
            Destroy(GameObject.Find("Card" + (12 - roundNr).ToString()));
        }
        
        GameObject topicCard = Instantiate(cardFlat, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicCard.name = "TopicCard";
        topicCard.transform.SetParent(GameObject.Find("Canvas").transform, false);
        deactivatePlayerInfoBox = true;
        yield return new WaitForSeconds(2.5f);
        //TODO here I have to add the correct topics
        float y = 164.6f;
        //StartCoroutine(DisplayInfoText("You have <color=#001AF6>30</color> Seconds to pick a Topic for this Round!",true,0));
        StartCoroutine(StartTextBox("Please vote for a Topic. The active player will have to guess the topic afterwards!", true, 0));
        for (int j = 0; j < 5; j++)
        {
            GameObject topicButton = Instantiate(topicButtonObject, new Vector3(-7.6f, y, 0), Quaternion.identity) as GameObject;
            GameObject.Find("ButtonCounter").name = "ButtonCounter" + (j + 1).ToString();
            GameObject.Find("TopicVoteNumber").name = "TopicVoteNumber" + (j + 1).ToString();
            GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = cardStack[roundNr].GetTopics()[j];
            GameObject.Find("TopicText").name = "TopicText" + (j + 1).ToString();
            topicButton.name = "TopicButton" + (j + 1).ToString();
            topicButton.transform.SetParent(GameObject.Find("Interaction").transform, false);

            yield return new WaitForSeconds(0.2f);
            y = y - 79f;
        }
        yield return new WaitForSeconds(0.5f);
        mockStats.SetRoundOutcome(false);
        round.SetRoundPhase(6);
    }

    public IEnumerator DrawCardActivePlayer(int roundNr)
    {
        if (mockStats.GetLastRoundOutcome()) //Last Round was lost
        {
            GameObject.Find("Card" + (12 - roundNr + 1).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
            drawCard.Play();
            yield return new WaitForSeconds(0.5f);


            GameObject.Find("Card" + (12 - roundNr).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
            drawCard.Play();
            yield return new WaitForSeconds(0.5f);
            GameObject.Find("CardsLeftText").GetComponent<TextMeshProUGUI>().text = "< " + (12 - roundNr).ToString() + " Left >";
            GameObject.Find("CardsLeftText").transform.localPosition = positions.DecreaseCardLeftTextPosition();
            Destroy(GameObject.Find("Card" + (12 - roundNr).ToString()));
            Destroy(GameObject.Find("Card" + (12 - roundNr + 1).ToString()));
        }
        else
        {
            GameObject.Find("Card" + (12 - roundNr).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
            drawCard.Play();
            yield return new WaitForSeconds(0.5f);
            GameObject.Find("CardsLeftText").GetComponent<TextMeshProUGUI>().text = "< " + (12 - roundNr).ToString() + " Left >";
            GameObject.Find("CardsLeftText").transform.localPosition = positions.DecreaseCardLeftTextPosition();
            Destroy(GameObject.Find("Card" + (12 - roundNr).ToString()));
        }
        mockStats.SetRoundOutcome(false);
    }


    public IEnumerator RemoveTopicCard()
    {
        yield return new WaitForSeconds(2f);
        deactivatePlayerInfoBox = false;
        GameObject.Find("TopicCard").GetComponent<Animator>().SetBool("disappear", true);
        for (int j = 0; j < 5; j++)
        {
            GameObject.Find("TopicButton" + (j + 1).ToString()).GetComponent<Animator>().SetBool("disappear", true);
        }
        yield return new WaitForSeconds(1f);
        Destroy(GameObject.Find("TopicCard"));
        for (int j = 0; j < 5; j++)
        {
            Destroy(GameObject.Find("TopicButton" + (j + 1).ToString()));
        }
        mockStats.UnlockInputForTopics(); //in order that players can enter their choice in the next round again
    }


    IEnumerator DuplicatetTopicVotesAnimationScreen()
    {
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Interaction").transform, false);
        yield return new WaitForSeconds(1f);
        round.DisplaySameVoteMessage();
    }


    public IEnumerator AnimateFlipBox(int activePlayer)
    {
        Animator dustAnimator;

        spinBubble.Play();
        //GameObject.Find("Player" + activePlayer.ToString() + "Avatar").SetActive(false);
        GameObject.Find("Player" + activePlayer.ToString() + "Avatar").GetComponent<Animator>().SetBool("disappear", true);
        GameObject.Find("Player" + activePlayer.ToString() + "Box").GetComponent<Animator>().SetBool("flip", true);
        yield return new WaitForSeconds(1.5f);
        if(GameObject.Find("Dust") != null)
        {
            GameObject dustAnimation = Instantiate(dust, new Vector3(-12f, 260f, 0), Quaternion.identity) as GameObject;
            string name = "Dust" + dustSeries;
            dustAnimation.name = name;
            dustSeries++;
            dustAnimation.transform.SetParent(GameObject.Find("Canvas").transform, false);
            yield return new WaitForSeconds(0.1f);
            GameObject.Find(name).transform.localPosition = positions.GetDustPosition(activePlayer - 1);
            dustAnimator = dustAnimation.GetComponent<Animator>();
            yield return new WaitForSeconds(0.25f);
            dustAnimator.SetBool("animateDust", true);
            lockSound.Play();
            yield return new WaitForSeconds(1.2f);
            Destroy(GameObject.Find(name));
        }
        else
        {
            GameObject dustAnimation = Instantiate(dust, new Vector3(-12f, 260f, 0), Quaternion.identity) as GameObject;
            dustAnimation.name = "Dust";
            dustAnimation.transform.SetParent(GameObject.Find("Canvas").transform, false);
            yield return new WaitForSeconds(0.1f);
            GameObject.Find("Dust").transform.localPosition = positions.GetDustPosition(activePlayer - 1);
            dustAnimator = dustAnimation.GetComponent<Animator>();
            yield return new WaitForSeconds(0.25f);
            dustAnimator.SetBool("animateDust", true);
            lockSound.Play();
            yield return new WaitForSeconds(1.2f);
            Destroy(GameObject.Find("Dust"));
        }
        dustSeries = 0;
        round.SetRoundPhase(4);
    }


    public IEnumerator AnimateUnflippBox(int activePlayer)
    {
        Animator dustAnimator;

        spinBubble.Play();
        GameObject.Find("Player" + activePlayer.ToString() + "Box").GetComponent<Animator>().SetBool("flip", false);
        GameObject.Find("Player" + activePlayer.ToString() + "Avatar").GetComponent<Animator>().SetBool("disappear", false);
        yield return new WaitForSeconds(1.5f);
        if (GameObject.Find("Dust") != null)
        {
            GameObject dustAnimation = Instantiate(dust, new Vector3(-12f, 260f, 0), Quaternion.identity) as GameObject;
            string name = "Dust" + dustSeries;
            dustAnimation.name = name;
            dustSeries++;
            dustAnimation.transform.SetParent(GameObject.Find("Canvas").transform, false);
            yield return new WaitForSeconds(0.1f);
            GameObject.Find(name).transform.localPosition = positions.GetDustPosition(activePlayer - 1);
            dustAnimator = dustAnimation.GetComponent<Animator>();
            yield return new WaitForSeconds(0.25f);
            dustAnimator.SetBool("animateDust", true);
            buttonSFX.Play();
            yield return new WaitForSeconds(1.2f);
            Destroy(GameObject.Find(name));
        }
        else
        {
            GameObject dustAnimation = Instantiate(dust, new Vector3(-12f, 260f, 0), Quaternion.identity) as GameObject;
            dustAnimation.name = "Dust";
            dustAnimation.transform.SetParent(GameObject.Find("Canvas").transform, false);
            yield return new WaitForSeconds(0.1f);
            GameObject.Find("Dust").transform.localPosition = positions.GetDustPosition(activePlayer - 1);
            dustAnimator = dustAnimation.GetComponent<Animator>();
            yield return new WaitForSeconds(0.25f);
            dustAnimator.SetBool("animateDust", true);
            buttonSFX.Play();
            yield return new WaitForSeconds(1.2f);
            Destroy(GameObject.Find("Dust"));
        }
        dustSeries = 0;
    }


    public IEnumerator ActivePlayerWaitsForTopics()
    {
        for(int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if(i != mockStats.GetActivePlayer())
            {
                StartCoroutine(AnimateFlipBox(i));
            }
        }
        yield return new WaitForSeconds(1.5f);
        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (i != mockStats.GetActivePlayer())
            {
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("wake",true);
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("thinking", true);
            }
        }
        yield return new WaitForSeconds(2f);
        StartCoroutine(StartTextBox("As you are the active player, you need to wait for the others to choose a Topic for this round!",true,2));
        Phase5HasLoaded = true;
        yield return new WaitForSeconds(0.1f);
    }

    public IEnumerator CleanUpRound()
    {
        if(mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
        {
            for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
            {
                if (i != mockStats.GetActivePlayer())
                {
                    StartCoroutine(AnimateUnflippBox(i));
                }
            }
        }
        else
        {
            StartCoroutine(AnimateUnflippBox(mockStats.GetActivePlayer()));
        }
        yield return new WaitForSeconds(1.5f);
        round.SetRoundPhase(25);
    }


    public IEnumerator ActivePlayerWaitsForClues()
    {
        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (i != mockStats.GetActivePlayer())
            {
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("wake", true);
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("thinking", true);
            }
        }
        yield return new WaitForSeconds(0.1f);
    }


    public IEnumerator PlayersWaitForOthersToSubmitClue()
    {
        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (i != mockStats.GetActivePlayer() && i != mockStats.GetPlayerPosition())
            {
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("wake", true);
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("thinking", true);
            }
        }
        ForceRemoveInfoBox();
        yield return new WaitForSeconds(1.5f);
        StartCoroutine((StartTextBox("Wait for the rest of your team to submit their clues", true, 2)));
        Phase5HasLoaded = true;
        yield return new WaitForSeconds(1f);
        Phase16HasLoaded = true;
    }


    IEnumerator FadeInScreen()
    {    
        yield return new WaitForSeconds(1f);
        GameObject.Find("FaderLeft").SetActive(false);
        GameObject.Find("FaderRight").SetActive(false);
    }


    public IEnumerator StartTextBox(string text, bool keepIdle, int mode)
    {
    if (GameObject.Find("Infoboard") != null || GameObject.Find("InfoText") != null || GameObject.Find("infoTag") != null ||
    GameObject.Find("loadingTag") != null)
        {
            StopTextBox();          
        }
        yield return new WaitForSeconds(0.2f);
        textBox = StartCoroutine(DisplayInfoText(text, keepIdle, mode));
    }

    public void StopTextBox()
    {
        StopCoroutine(textBox);
        Destroy(GameObject.Find("Infoboard"));
        Destroy(GameObject.Find("InfoText"));
        if(GameObject.Find("infoTag") != null)
        {
            Destroy(GameObject.Find("infoTag"));
        }
        if (GameObject.Find("loadingTag") != null)
        {
            Destroy(GameObject.Find("loadingTag"));
        }
    }

    //Mode Documentation: 0 = nothing; 1 = info; 2 = loading
    public IEnumerator DisplayInfoText(string text, bool keepIdle, int mode)
    {
        GameObject infoBoard = Instantiate(infoBar, new Vector3(-12f, 260f, 0), Quaternion.identity) as GameObject;
        infoBoard.name = "Infoboard";
        infoBoard.transform.SetParent(GameObject.Find("Canvas").transform, false);

        GameObject infoText = Instantiate(infoBarText, new Vector3(-75f, 285f, 0), Quaternion.identity) as GameObject;
        infoText.name = "InfoText";
        infoText.transform.SetParent(GameObject.Find("Canvas").transform, false);

        infoBarAnimator = infoBoard.GetComponent<Animator>();
        infoTextAnimator = infoText.GetComponent<Animator>();
        tmproInfoText = infoText.GetComponent<TextMeshProUGUI>();

        if (mode == 0)
        {

        }
        else if (mode == 1)
        {
            GameObject infoTag = Instantiate(infoTagObject, new Vector3(396, 0, 0), Quaternion.identity) as GameObject;
            infoTag.name = "infoTag";
            infoTag.transform.SetParent(GameObject.Find("Infoboard").transform, false);
        }
        else if (mode == 2)
        {
            GameObject loadingTag = Instantiate(loadingTagObject, new Vector3(395, 0, 0), Quaternion.identity) as GameObject;
            loadingTag.name = "loadingTag";
            loadingTag.transform.SetParent(GameObject.Find("Infoboard").transform, false);
        }

        notification.Play();
        tmproInfoText.text = text;
        infoBarAnimator.SetBool("displayInfoBar", true);
        infoTextAnimator.SetBool("wake", true);
        if (keepIdle)
        {
            keepInfoTextIdle = true;
            while (keepInfoTextIdle)
            {
                yield return new WaitForSeconds(0.1f);
            }
        }
        else
        {
            yield return new WaitForSeconds(4.9f);
        }

        infoBarAnimator.SetBool("displayInfoBar", false);
        infoTextAnimator.SetBool("wake", false);
        if (mode == 0)
        {
            yield return new WaitForSeconds(1f);
        }
        else if (mode == 1)
        {
            GameObject.Find("infoTag").GetComponent<Animator>().SetBool("disappear", true);
            yield return new WaitForSeconds(1f);
            Destroy(GameObject.Find("infoTag"));
        }
        else if (mode == 2)
        {
            GameObject.Find("loadingTag").GetComponent<Animator>().SetBool("disappear", true);
            yield return new WaitForSeconds(1f);
            Destroy(GameObject.Find("loadingTag"));
        }
        Destroy(GameObject.Find("Infoboard"));
        Destroy(GameObject.Find("InfoText"));
        if (mode == 1)
        {
            Destroy(GameObject.Find("infoTag"));
        }
        else if (mode == 2)
        {
            Destroy(GameObject.Find("loadingTag"));
        }

    }


    public void HardDeleteInfoBox()
    {
        if (GameObject.Find("Infoboard") != null)
        {
            Destroy(GameObject.Find("Infoboard"));
        }
        if (GameObject.Find("InfoText") != null)
        {
            Destroy(GameObject.Find("InfoText"));
        }
        if (GameObject.Find("infoTag") != null)
        {
            Destroy(GameObject.Find("infoTag"));
        }
        if (GameObject.Find("loadingTag") != null)
        {
            Destroy(GameObject.Find("loadingTag"));
        }
    }

    //This is just an Animaton notation for the Active Player once the players have chosen their topic
    public IEnumerator PlayersHaveChosenTheirTopic()
    {
        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (i == mockStats.GetActivePlayer())
            {

            }
            else
            {
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("finished", false);
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("thinking", false);
                GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("wake", false);
            }
        }
        ForceRemoveInfoBox();
        StartCoroutine(NotifyPlayerThatTopicHasBeenChosen());
        yield return new WaitForSeconds(5f);
        StartCoroutine(StartTextBox("The players have chosen their Topic for this Round. They will now give you clues. Hold on...", true, 2));
        StartCoroutine(ActivePlayerWaitsForClues());
        yield return new WaitForSeconds(2.5f);       
    }

    public IEnumerator PlayersHaveSubmittedTheirClues(bool activePlayer)
    {
        yield return new WaitForSeconds(1f);
        if (activePlayer) //the Active Player is calling this function
        {
            for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
            {
                if (i == mockStats.GetActivePlayer())
                {

                }
                else
                {
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("finished", false);
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("thinking", false);
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("wake", false);
                }
            }
            ForceRemoveInfoBox();
            StartCoroutine(NotifyPlayerhaveSubmittedTheirClue());
            yield return new WaitForSeconds(5f);
            //HardDeleteInfoBox();
            StartCoroutine(StartTextBox("Now it's your turn to guess the correct Mistery Word...", true, 0));
            yield return new WaitForSeconds(2f);
            round.SetRoundPhase(9);
        }
        else //the non-active players are calling this function
        {
            for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
            {
                if (i == mockStats.GetActivePlayer() || i == mockStats.GetPlayerPosition())
                {

                }
                else
                {
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("finished", false);
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("thinking", false);
                    GameObject.Find("ThinkingBubble" + i).GetComponent<Animator>().SetBool("wake", false);
                }
            }
            ForceRemoveInfoBox();
            StartCoroutine(NotifyPlayerhaveSubmittedTheirClue());
            yield return new WaitForSeconds(5f);
            //HardDeleteInfoBox();
            StartCoroutine(StartTextBox("The active player is now guessing...wait for him to submit his guess", true, 2));
            GameObject.Find("ThinkingBubble" + mockStats.GetActivePlayer()).GetComponent<Animator>().SetBool("wake", true);
            GameObject.Find("ThinkingBubble" + mockStats.GetActivePlayer()).GetComponent<Animator>().SetBool("thinking", true);
            yield return new WaitForSeconds(2f);
        }
    }


    public IEnumerator PlayersEnterMisteryWord()
    {
        ForceRemoveInfoBox();
        yield return new WaitForSeconds(0.5f);
        StartCoroutine(StartTextBox("Please entere a clue that best describes the current topic (Only a single word)", true, 0));
        yield return new WaitForSeconds(1f);
        GameObject.Find("TimerScript").GetComponent<Timer>().StartTimer(30);
        yield return new WaitForSeconds(0.1f);
        round.SetRoundPhase(14);
    }


    //This is just an Animaton notation for the Active Player once the players have chosen their topic
    public IEnumerator ActivePlayerHasSubmittedHisGuess()
    {
        notification.Play();
        GameObject.Find("ThinkingBubble" + mockStats.GetActivePlayer()).GetComponent<Animator>().SetBool("finished", true);
        yield return new WaitForSeconds(0.5f);
        GameObject.Find("ThinkingBubble" + mockStats.GetActivePlayer()).GetComponent<Animator>().SetBool("finished", false);
        GameObject.Find("ThinkingBubble" + mockStats.GetActivePlayer()).GetComponent<Animator>().SetBool("thinking", false);
        GameObject.Find("ThinkingBubble" + mockStats.GetActivePlayer()).GetComponent<Animator>().SetBool("wake", false);
        ForceRemoveInfoBox();
        //HardDeleteInfoBox();
    }


    //Display the clues of the other players
    public IEnumerator DisplayCluesFromPlayers()
    {
        GameObject cluesBGTemp = Instantiate(cluesBG, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        cluesBGTemp.name = "CluesBGTemp";
        cluesBGTemp.transform.SetParent(GameObject.Find("Canvas").transform, false);
        int count = 0;
        int j = 0;
        for (int i = 0; i <= mockStats.GetTotalNumberOfPlayers()-1; i++)
        {
            if(i == mockStats.GetActivePlayer()-1)
            {
                j -= 1;
            }
            else
            {
                if (count == 0)
                {
                    GameObject clue = Instantiate(clueContainer, new Vector3(-105f, -290f, 0), Quaternion.identity) as GameObject;
                    clue.name = "clue" + i;
                    clue.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("ClueText").name = "ClueText" + i;
                    GameObject.Find("ClueText" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetClueList()[j];
                    GameObject.Find("ClueTitle").name = "ClueTitle" + i;
                    //GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i);
                    GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = "Player Clues";
                }
                else if (count == 1)
                {
                    GameObject clue = Instantiate(clueContainer, new Vector3(109f, -290f, 0), Quaternion.identity) as GameObject;
                    clue.name = "clue" + i;
                    clue.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("ClueText").name = "ClueText" + i;
                    GameObject.Find("ClueText" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetClueList()[j];
                    GameObject.Find("ClueTitle").name = "ClueTitle" + i;
                    //GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i);
                    GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = "Player Clues";
                }
                else if (count == 2)
                {
                    GameObject clue = Instantiate(clueContainer, new Vector3(-316f, -290f, 0), Quaternion.identity) as GameObject;
                    clue.name = "clue" + i;
                    clue.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("ClueText").name = "ClueText" + i;
                    GameObject.Find("ClueText" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetClueList()[j];
                    GameObject.Find("ClueTitle").name = "ClueTitle" + i;
                    //GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i);
                    GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = "Player Clues";
                }
                else if (count == 3)
                {
                    GameObject clue = Instantiate(clueContainer, new Vector3(321f, -290f, 0), Quaternion.identity) as GameObject;
                    clue.name = "clue" + i;
                    clue.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("ClueText").name = "ClueText" + i;
                    GameObject.Find("ClueText" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetClueList()[j];
                    GameObject.Find("ClueTitle").name = "ClueTitle" + i;
                    //GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i);
                    GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = "Player Clues";
                }
                else if (count == 4)
                {
                    GameObject clue = Instantiate(clueContainer, new Vector3(-528f, -290f, 0), Quaternion.identity) as GameObject;
                    clue.name = "clue" + i;
                    clue.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("ClueText").name = "ClueText" + i;
                    GameObject.Find("ClueText" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetClueList()[j];
                    GameObject.Find("ClueTitle").name = "ClueTitle" + i;
                    //GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i);
                    GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = "Player Clues";
                }
                else if (count == 5)
                {
                    GameObject clue = Instantiate(clueContainer, new Vector3(536f, -290f, 0), Quaternion.identity) as GameObject;
                    clue.name = "clue" + i;
                    clue.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("ClueText").name = "ClueText" + i;
                    GameObject.Find("ClueText" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetClueList()[j];
                    GameObject.Find("ClueTitle").name = "ClueTitle" + i;
                    //GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i);
                    GameObject.Find("ClueTitle" + i).GetComponent<TextMeshProUGUI>().text = "Player Clues";
                }
                else
                {

                }
                count += 1;
            }
            j += 1;
            yield return new WaitForSeconds(0.25f);
        }
        yield return new WaitForSeconds(0.1f);
    }

    public IEnumerator RemoveClues()
    {
        for (int i = 0; i <= mockStats.GetTotalNumberOfPlayers()-1; i++)
        {
            if (i == mockStats.GetActivePlayer()-1)
            {
                
            }
            else
            {
                GameObject.Find("clue" + i).GetComponent<Animator>().SetBool("disappear", true);
            }
        }
        yield return new WaitForSeconds(2f);
        for (int i = 0; i <= mockStats.GetTotalNumberOfPlayers()-1; i++)
        {
            if (i == mockStats.GetActivePlayer()-1)
            {

            }
            else
            {
                GameObject.Find("clue" + i).GetComponent<Animator>().SetBool("disappear", false);
                Destroy(GameObject.Find("clue" + i));
            }
        }
    }


    public IEnumerator ShowRoundEvaluation(bool success)
    {
        yield return new WaitForSeconds(1f);
        if (success)
        {
            applausSFX.Play();
            successParticles.SetActive(true);
            yield return new WaitForSeconds(2f);
            applausSFX.Play();
            yield return new WaitForSeconds(2f);
            successParticles.SetActive(false);
        }
        else
        {
            failSFX.Play();
            yield return new WaitForSeconds(5f);
        }
        ForceRemoveInfoBox();
        yield return new WaitForSeconds(2f);
        //HardDeleteInfoBox();
        round.SetRoundPhase(23);
    }


    public IEnumerator EasterEgg()
    {
        successParticles.SetActive(true);
        yield return new WaitForSeconds(1f);
        GameObject thanh = Instantiate(thanhPilotObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        thanh.name = "ThanhPilot";
        thanh.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(9f);
        GameObject.Find("ThanhPilot").GetComponent<Animator>().SetBool("away", true);
        successParticles.SetActive(false);
    }


    public IEnumerator ResetScoreBoardAni()
    {     
        yield return new WaitForSeconds(1f);
        GameObject.Find("ScoreBoard").GetComponent<Animator>().SetBool("transition", false);

    }

    IEnumerator SetUpScoreBoard()
    {
        yield return new WaitForSeconds(2f);
        scoreMultiplier = Instantiate(ScoreMultiplierBox, new Vector3(-565, 148, 0), Quaternion.identity) as GameObject;
        scoreMultiplier.name = "ScoreMultiplier";
        scoreMultiplier.transform.SetParent(GameObject.Find("Canvas").transform, false);

        scoreBoard = Instantiate(scoreBoardContainer, new Vector3(-6, 280, 0), Quaternion.identity) as GameObject;
        scoreBoard.name = "ScoreBoard";
        scoreBoard.transform.SetParent(GameObject.Find("Canvas").transform, false);
        GameObject.Find("ScoreText").GetComponent<TextMeshProUGUI>().text = "Game Overview";
        GameObject.Find("ScoreNumber").GetComponent<TextMeshProUGUI>().text = round.GetRound().ToString();

        int x_mini = -73;
        for (int k = 1; k <= 13; k++)
        {
            if (k >= 8)
            {
                GameObject miniCard = Instantiate(miniCardObject, new Vector3(x_mini, -67f, 0), Quaternion.identity) as GameObject;
                miniCard.name = "MiniCard" + k.ToString();
                miniCard.transform.SetParent(GameObject.Find("ScoreBoard").transform, false);
                x_mini += 25;
            }
            else
            {
                GameObject miniCard = Instantiate(miniCardObject, new Vector3(x_mini, -34, 0), Quaternion.identity) as GameObject;
                miniCard.name = "MiniCard" + k.ToString();
                miniCard.transform.SetParent(GameObject.Find("ScoreBoard").transform, false);
                x_mini += 25;
                if (k == 7)
                {
                    x_mini = -63;
                }
            }
        }
    }


    public IEnumerator NewRoundStartsAnimation()
    {
        if(round.GetRound() >= 12)
        {

        }
        else
        {
            waitForSetUp = false;
            GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
            blackScreen.name = "BlackScreen";
            blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
            yield return new WaitForSeconds(1.0f);
            GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
            topicBar.name = "TopicBar";
            topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
            barAppearsSFX.Play();
            GameObject.Find("TopicBar").GetComponent<Animator>().SetBool("positive", true);
            GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "The next round is about to start...";
            GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...prepare yourselfs!";
            yield return new WaitForSeconds(1.0f);
            barCheckSFX.Play();
            yield return new WaitForSeconds(3.2f);
            waitForSetUp = true;
            Destroy(GameObject.Find("TopicBar"));
            Destroy(GameObject.Find("BlackScreen"));
            round.SetRoundPhase(1);
        }
    }


    public IEnumerator WaitShortly()
    {
        yield return new WaitForSeconds(1.0f);
        round.ActivateWaiter();
    }

    public IEnumerator FadeScreenCompletely()
    {
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen2";
        blackScreen.transform.SetParent(GameObject.Find("Interaction").transform, false);
        GameObject.Find("BlackScreen2").GetComponent<Animator>().SetBool("completeBlack", true);
        yield return new WaitForSeconds(1.0f);
    }
}

