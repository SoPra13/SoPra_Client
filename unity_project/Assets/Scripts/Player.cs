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


    public void SetPlayerName(string name)
    {
        playerName = name;
    }

    public string GetPlayerName()
    {
        return playerName;
    }

    public void SetId(long id)
    {
        playerID = id;
    }

    public long GetId()
    {
        return playerID;
    }

    public void SetAvater(int avatar)
    {
        playerAvatar = avatar;
    }

    public int GetAvatar()
    {
        return playerAvatar;
    }

    public void SetInput(string input)
    {
        playerInput = input;
    }

    public string GetInput()
    {
        return playerInput;
    }

    public void SetPos(Vector3 pos)
    {
        playerPos = pos;
    }

    public Vector3 GetPos()
    {
        return playerPos;
    }


}
