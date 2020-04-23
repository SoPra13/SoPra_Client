using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using System.Linq;

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

    private bool advanceToState3 = false;
    private bool waitForServerTopicResponse = false;
    private bool serverRespondedToTopic = false;
    private bool timerPhase1Ended = false;
    private bool startGame = true;
    private bool keepInfoTextIdle = false;
    private bool Phase5HasLoaded = false;
    //private bool phase6TransitionOngoing = false;



    void Start()
    {

        gameMusic.volume = 0.5f;
        SetUpInitialBoard();
        StartCoroutine(FadeInScreen());
        StartCoroutine(GameStarts());
    }


    private void SetUpInitialBoard()
    {
        misteryWordContainer = Instantiate(misteryWordInputContainer, new Vector3(0,0,0), Quaternion.identity) as GameObject;
        misteryWordContainer.name = "MisteryWordInput";
        misteryWordContainer.transform.SetParent(GameObject.Find("Interaction").transform,false);
        misteryWordContainer.SetActive(false);

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


    private void Update()
    {
        if (startGame)
        {
            if (roundState == 1)
            {

            }

            //Topic Picking Phase//
            //In here I have to coninuously ask for the topic Choice array which has to be delivered by the Backend
            /*else if (roundState == 2)
            {
                topics = mockStats.GetTopicInput();

                for (int i = 1; i <= 5; i++)
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
                if (sum >= (mockStats.GetTotalNumberOfPlayers() - 1) || timerPhase1Ended)
                {
                    StartCoroutine(RemoveTopicCard()); //remove the topic card and then continue
                    roundState = 3;
                }
            }*/

            //Topic votes have been send, now we check if there are any duplicate votes//
            else if (roundState == 3 && advanceToState3)
            {
                //I need to check whether there is a category that has the same amount of votes:
                if (topics.Length != topics.Distinct().Count()) //If yes, array contains duplictes
                {
                    if (!waitForServerTopicResponse)//Just for animation purposes
                    {
                        StartCoroutine(DuplicatetTopicVotesAnimationScreen());
                        waitForServerTopicResponse = true;
                    }

                    if (serverRespondedToTopic)//Wait for the Server to pick the topic
                    {

                    }
                }

                timer.DeactivateTimer();
            }
            else if (roundState == 4)
            {

            }
            else
            {

            }
        }
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


    public void DisplayMisteryInputBox()
    {
        misteryWordContainer.SetActive(true);
        GameObject.Find("TopicTextReminder").GetComponent<TextMeshProUGUI>().text = mockStats.GetCurrentTopic();
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
                round.SetRoundPhase(6);
                Phase5HasLoaded = false;
            }
        }

    }


    public IEnumerator ShowThisRoundsTopic()
    {
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1.0f);
        GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicBar.name = "TopicBar";
        topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        barAppearsSFX.Play();
        GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = mockStats.GetCurrentTopic();
        yield return new WaitForSeconds(1.0f);
        barCheckSFX.Play();
        yield return new WaitForSeconds(3.2f);
        round.SetRoundPhase(13);
        Destroy(GameObject.Find("TopicBar"));
        Destroy(GameObject.Find("BlackScreen"));
    }

    public IEnumerator NotifyPlayerThatTopicHasBeenChosen()
    {
        GameObject blackScreen = Instantiate(blackScreenObject, new Vector3(0, 0, -10), Quaternion.identity) as GameObject;
        blackScreen.name = "BlackScreen";
        blackScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1.0f);
        GameObject topicBar = Instantiate(topicBarObject, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicBar.name = "TopicBar";
        topicBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        barAppearsSFX.Play();
        GameObject.Find("TopicText").GetComponent<TextMeshProUGUI>().text = "Your Team has chosen...";
        GameObject.Find("TopicText2").GetComponent<TextMeshProUGUI>().text = "...a Topic for this Round!";
        yield return new WaitForSeconds(1.0f);
        barCheckSFX.Play();
        yield return new WaitForSeconds(3.2f);
        Destroy(GameObject.Find("TopicBar"));
        Destroy(GameObject.Find("BlackScreen"));
    }


    IEnumerator GameStarts()
    {
        yield return new WaitForSeconds(4f);
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
        GameObject.Find("Card" + (12 - roundNr).ToString()).GetComponent<Animator>().SetBool("drawCard", true);
        drawCard.Play();
        yield return new WaitForSeconds(0.5f);
        GameObject.Find("CardsLeftText").GetComponent<TextMeshProUGUI>().text = "< " + (12 - roundNr).ToString() + " Left >";
        GameObject.Find("CardsLeftText").transform.localPosition = positions.DecreaseCardLeftTextPosition();
        Destroy(GameObject.Find("Card" + (12 - roundNr).ToString()));
        GameObject topicCard = Instantiate(cardFlat, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        topicCard.name = "TopicCard";
        topicCard.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(2.5f);
        //TODO here I have to add the correct topics
        float y = 164.6f;
        StartCoroutine(DisplayInfoText("You have <color=#001AF6>30</color> Seconds to pick a Topic for this Round!",true,0));
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
        round.SetRoundPhase(6);
        //roundState = 2;
    }


    public IEnumerator RemoveTopicCard()
    {
        //round.InterruptTimer();
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
        advanceToState3 = true;
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
        GameObject.Find("Player" + activePlayer.ToString() + "Avatar").SetActive(false);
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
        yield return new WaitForSeconds(2.5f);
        StartCoroutine(DisplayInfoText("As you are the active player, you need to wait for the others to choose a Topic for this round!",true,2));
        Phase5HasLoaded = true;
        yield return new WaitForSeconds(0.1f);
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


    IEnumerator FadeInScreen()
    {    
        yield return new WaitForSeconds(1f);
        GameObject.Find("FaderLeft").SetActive(false);
        GameObject.Find("FaderRight").SetActive(false);
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

        if(mode == 0)
        {

        }else if (mode == 1)
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
            yield return new WaitForSeconds(6f);
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
        StartCoroutine(DisplayInfoText("The players have chosen their Topic for this Round. They will now give you clues. Hold on...", true, 2));
        StartCoroutine(ActivePlayerWaitsForClues());
        yield return new WaitForSeconds(2.5f);       
    }


    public IEnumerator PlayersEnterMisteryWord()
    {
        ForceRemoveInfoBox();
        yield return new WaitForSeconds(1f);
        StartCoroutine(DisplayInfoText("Please entere a clue that best describes the current topic (Only a single word)", true, 2));
    }
}

