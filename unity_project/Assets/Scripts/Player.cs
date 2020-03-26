using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    
    private string playerName;
    private long playerID;
    private int playerAvatar;
    private string playerInput;
    private Vector3 playerPos;

    public Player(string name, int id, int avatar)
    {
    playerName = name;
    playerID = id;
    playerAvatar = avatar;
    }

    public Player()
    {
        playerName = "test";
        playerID = 0;
        playerAvatar = 0;
    }


    public void setPlayerName(string name)
    {
        playerName = name;
    }

    public string getPlayerName()
    {
        return playerName;
    }

    public void setId(long id)
    {
        playerID = id;
    }

    public long getId()
    {
        return playerID;
    }

    public void setAvater(int avatar)
    {
        playerAvatar = avatar;
    }

    public int getAvatar()
    {
        return playerAvatar;
    }

    public void setInput(string input)
    {
        playerInput = input;
    }

    public string getInput()
    {
        return playerInput;
    }

    public void setPos(Vector3 pos)
    {
        playerPos = pos;
    }

    public Vector3 getPos()
    {
        return playerPos;
    }


}
