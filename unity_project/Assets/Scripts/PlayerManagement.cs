using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerManagement : MonoBehaviour
{
    public Player[] playerArray;
    public MockStats mockStats;
    public Positions entityPositions;
    [SerializeField] private GameObject basePlayer;


    void Start()
    {
        DontDestroyOnLoad(transform.root.gameObject);
        playerArray = new Player[mockStats.GetTotalNumberOfPlayers()];

        for (int i = 0; i< mockStats.GetTotalNumberOfPlayers(); i++)
        {
            playerArray[i] = Instantiate(basePlayer, transform).GetComponent<Player>();
            playerArray[i].name = "Player" + i;
        }
        
        UpdatePlayers();
    }


    public void UpdatePlayers()
    {
        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            GetCorrectPlayerObject(i).SetPlayerName(mockStats.GetName(i - 1));
            GetCorrectPlayerObject(i).SetAvater(mockStats.GetAvatar(i - 1));

            if (mockStats.GetPlayerPosition() == i)
            {
                GetCorrectPlayerObject(i).SetPos(entityPositions.GetMainPosition(i - 1));
            }
            else
            {
                GetCorrectPlayerObject(i).SetPos(entityPositions.GetOffPosition(i - 1));
            }
        }
    }


    public Player GetCorrectPlayerObject(int i)
    {
        return playerArray[i-1];
    }
}
