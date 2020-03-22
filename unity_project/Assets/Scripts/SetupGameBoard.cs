using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using System.Linq;

public class SetupGameBoard : MonoBehaviour
{
    static Card card1 = new Card(1);
    static Card card2 = new Card(2);
    static Card card3 = new Card(3);
    static Card card4 = new Card(4);
    static Card card5 = new Card(5);
    static Card card6 = new Card(6);
    static Card card7 = new Card(7);
    static Card card8 = new Card(8);
    static Card card9 = new Card(9);
    static Card card10 = new Card(10);
    static Card card11 = new Card(11);
    static Card card12 = new Card(12);
    static Card card13 = new Card(13);

    public GameObject playerBox;
    public GameObject otherPlayers;
    public TextMeshProUGUI userName;
    public GameObject cardIso;
    public TextMeshProUGUI cardLeftText;
    private Avatars avatars;
    private UserNames nameClass;
    private int playerPosition; //this value needs to come from React
    //Avatars avatars = new Avatars();



    // Start is called before the first frame update
    void Start()
    {
        //just for testing
        //PlayerCounter.playerTotal = 7;
        string[] topicArray = { "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Stone", "Hero", "Lasergun", "Ladybug", "Spike"};
        //

        avatars = GameObject.Find("Canvas").GetComponent<Avatars>();
        nameClass = GameObject.Find("Canvas").GetComponent<UserNames>();

        for (int i = 1; i <= PlayerCounter.playerTotal; i++)
        {
            if(PlayerCounter.playerPosition == i)
            {
                PlayerCounter.GetCorrectPlayerObject(i).getPlayerName();
                GameObject mainBox = Instantiate(playerBox, PlayerCounter.GetCorrectPlayerObject(i).getPos(), Quaternion.identity) as GameObject;
                mainBox.transform.SetParent(GameObject.Find("Canvas").transform, false);
                TextMeshProUGUI playerName = Instantiate(userName, nameClass.getNamePos(i), Quaternion.identity);
                playerName.text = PlayerCounter.GetCorrectPlayerObject(i).getPlayerName();
                playerName.transform.SetParent(GameObject.Find("Canvas").transform, false);
            }
            else
            {
                PlayerCounter.GetCorrectPlayerObject(i).getPlayerName();
                GameObject box = Instantiate(otherPlayers, PlayerCounter.GetCorrectPlayerObject(i).getPos(), Quaternion.identity) as GameObject;
                box.transform.SetParent(GameObject.Find("Canvas").transform, false);
            }
            //Debug.Log("Avatar Response: " + avatars.getAvatar(1));
            GameObject avatar = Instantiate(avatars.getAvatar(PlayerCounter.GetCorrectPlayerObject(i).getAvatar()), avatars.getAvatarPos(i), Quaternion.identity) as GameObject;
            avatar.transform.SetParent(GameObject.Find("Canvas").transform, false);
        }

        //Setup Card Stack of 13 Cards in the Middle
        //Here I need to fetch the topics from the Backend (1 Card has 5 Topics)
        float x = -14;
        float y = -124;
        for(int i = 0; i < 13; i++)
        {
            GameObject card = Instantiate(cardIso, new Vector3(x, y, 0f), Quaternion.identity);
            card.transform.SetParent(GameObject.Find("Canvas").transform, false);
            //x += 0;
            y += 4;
        }

        //Set up the number of Cards left
        TextMeshProUGUI cardsLeftText = Instantiate(cardLeftText, new Vector3(-16,-86,0), Quaternion.identity);
        cardsLeftText.transform.SetParent(GameObject.Find("Canvas").transform, false);
        SetCardStack(topicArray);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    //this List needs to contain 65 word (5 x 13). Word 0 - 4 is for card 1, word 5 - 9 for card 2 etc
    //This List is a REACT INPUT
    public void SetCardStack(string[] cardText)
    {
        card1.setTopics(cardText.Take(5).ToArray());
        card2.setTopics(cardText.Skip(5).Take(5).ToArray());
        card3.setTopics(cardText.Skip(10).Take(5).ToArray());
        card4.setTopics(cardText.Skip(15).Take(5).ToArray());
        card5.setTopics(cardText.Skip(20).Take(5).ToArray());
        card6.setTopics(cardText.Skip(25).Take(5).ToArray());
        card7.setTopics(cardText.Skip(30).Take(5).ToArray());
        card8.setTopics(cardText.Skip(35).Take(5).ToArray());
        card9.setTopics(cardText.Skip(40).Take(5).ToArray());
        card10.setTopics(cardText.Skip(45).Take(5).ToArray());
        card11.setTopics(cardText.Skip(50).Take(5).ToArray());
        card12.setTopics(cardText.Skip(55).Take(5).ToArray());
        card13.setTopics(cardText.Skip(60).Take(5).ToArray());
    }

}
