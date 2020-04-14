using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameFlow : MonoBehaviour
{
    [SerializeField] private MockStats mockStats;
    private int roundNr; //initialized with 1 for Round 1
    public TextMeshProUGUI infoText;
    public GameObject lockedBubble;
    public GameObject infoBar;

    public GameFlow(int rounNrInput)
    {
        roundNr = rounNrInput;
    }

    // Start is called before the first frame update
    void Start()
    {
        mockStats = GameObject.FindWithTag("MockStats").GetComponent<MockStats>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void NextRound(Card card)
    {
        //In this case the viewing player is the active player
        /*if(PlayerCounter.activePlayer == mockStats.GetPlayerPosition())
        {
            //Active Player Draws a card
            //Non-Active Players can see the Topics on this Card
            //Active Player chooses number between 1 and 5
            //Player can decide to keep this topic, the active player can choose a different word
        }
        else //In this case, the viewing player isn't the active player
        {

        }*/


        //Condition do terminate the game
        if(card.GetCardId() == 13)
        {
            //EndGame
        }
        else
        {

        }
    }
}
