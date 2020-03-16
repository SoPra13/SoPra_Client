using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class PlayerCounter : MonoBehaviour
{

    public TextMeshProUGUI totalPlayers;
    public TextMeshProUGUI connectedPlayers;
    static private int playerCount;
    static public int playerTotal;
    private List<Player> playerList = new List<Player>();

    Player p1 = new Player();
    Player p2 = new Player();
    Player p3 = new Player();
    Player p4 = new Player();
    Player p5 = new Player();
    Player p6 = new Player();
    Player p7 = new Player();


    // Start is called before the first frame update
    void Start()
    {
        playerCount = 0;
        playerTotal = 0; //TODO This is just for testing, set to 0 afterwards
    }

    // Update is called once per frame
    void Update()
    {
        totalPlayers.text = "/" + playerTotal.ToString();
        connectedPlayers.text = playerCount.ToString();
        if (playerTotal == playerCount)
        {
            //transition to next scene
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
        }
    }

    public void AddPlayer()
    {
        playerCount++;
    }

    public void SetPlayerTotal(int total)
    {
        playerTotal = total;
    }

    //Input: Array of String Playernames; Sets Names of Player Objects (Need to come from the Database)
    public void UpdatePlayers(string[] name, long[] id, int[] avatar, string[] input)
    { 
        for(int i = 1; i <= name.Length; i++)
        {
            GetCorrectPlayerObject(i).setPlayerName(name[i]);
            GetCorrectPlayerObject(i).setId(id[i]);
            GetCorrectPlayerObject(i).setAvater(avatar[i]);
            GetCorrectPlayerObject(i).setInput(input[i]);
        }
    }


    //Helper function go get correct playerobject
    private Player GetCorrectPlayerObject(int i)
    {
        if(i == 1)
        {
            return p1;
        }
        if (i == 2)
        {
            return p2;
        }
        if (i == 3)
        {
            return p3;
        }
        if (i == 4)
        {
            return p4;
        }
        if (i == 5)
        {
            return p5;
        }
        if (i == 6)
        {
            return p6;
        }
        if (i == 7)
        {
            return p7;
        }
        else
        {
            return null;
        }

    }



    
}
