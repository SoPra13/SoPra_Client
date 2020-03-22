using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;
using System.Runtime.InteropServices;

public class PlayerCounter : MonoBehaviour
{
    //The following part is for React Communication
    [DllImport("__Internal")]
    private static extern void ComTest(int score);

    public TextMeshProUGUI totalPlayers;
    public TextMeshProUGUI connectedPlayers;
    static public int playerCount;
    static public int playerTotal; //accessed from other classes
    private List<Player> playerList = new List<Player>();
    static public int playerPosition; //REACTINPUT this value needs to come from React, Unity uses it to determine who the player is
    static public int activePlayer; //REACTINPUT this value is needed to check who currently is the active player, initially has to be randomized by REACT

    static Player p1 = new Player();
    static Player p2 = new Player();
    static Player p3 = new Player();
    static Player p4 = new Player();
    static Player p5 = new Player();
    static Player p6 = new Player();
    static Player p7 = new Player();


    // Start is called before the first frame update
    void Start()
    {
        //The following is for unity-react communication testing
        ComTest(666);


        //for testing: These arrays need to come from react and react needs to get them from the server
        string[] names = { "Chris", "Thanh", "Marc", "Ivan", "Simon", "E.T.", "Rambo" };
        long[] id = { 1,2,3,4,5,6,7 };
        int[] avatar = { 1,2,3,4,5,6,7 };
        string[] input = { null,null,null,null,null,null,null };
        playerPosition = 1; //REACTINPUT this value needs to come from React
        playerTotal = 7; // This is just for testing, set to 0 afterwards
        activePlayer = Random.Range(1, 7); //JUST FOR TESTING, intially, REACT has to set a random Number depending on the amount of players in the game
        //

        Vector3[] posMainArray = { Constants.p1PosMain, Constants.p2PosMain, Constants.p3PosMain, Constants.p4PosMain, Constants.p5PosMain, Constants.p6PosMain, Constants.p7PosMain };
        Vector3[] posOffArray = { Constants.p1PosOff, Constants.p2PosOff, Constants.p3PosOff, Constants.p4PosOff, Constants.p5PosOff, Constants.p6PosOff, Constants.p7PosOff };
        playerCount = 0;
        UpdatePlayers(names,id,avatar,input, posMainArray, posOffArray);
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

    public void SetPlayerCount(int count)
    {
        playerCount = count;
    }

    public void SetPlayerTotal(int total)
    {
        playerTotal = total;
    }

    //Input: Array of String Playernames; Sets Names of Player Objects (Need to come from the Database)
    public void UpdatePlayers(string[] name, long[] id, int[] avatar, string[] input, Vector3[] mainPos, Vector3[] offPos)
    {
        for(int i = 1; i <= name.Length; i++)
        {
            GetCorrectPlayerObject(i).setPlayerName(name[i-1]);
            GetCorrectPlayerObject(i).setId(id[i-1]);
            GetCorrectPlayerObject(i).setAvater(avatar[i-1]);
            GetCorrectPlayerObject(i).setInput(input[i-1]);
            if (playerPosition == i)
            {
                GetCorrectPlayerObject(i).setPos(mainPos[i - 1]);
            }
            else
            {
                GetCorrectPlayerObject(i).setPos(offPos[i - 1]);
            }

        }
    }

    //This needs to be called by REACT
    private void SetPlayerPosition(int pos)
    {
        playerPosition = pos;
    }


    //Helper function go get correct playerobject
    static public Player GetCorrectPlayerObject(int i)
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
