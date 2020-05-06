using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UXBubble : MonoBehaviour
{
    public GameObject playerInfoBox;
    private GameObject playerInfo;

    private MockStats mockStats;
    private Positions positions;
    private GameBoard gameBoard;
    private GameObject rank;

    public GameObject rank0;
    public GameObject rank1;
    public GameObject rank2;
    public GameObject rank3;
    public GameObject rank4;


    private bool isOver = false;

    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
        positions = GameObject.Find("Positions").GetComponent<Positions>();
        gameBoard = GameObject.Find("Canvas").GetComponent<GameBoard>();
    }

    void OnMouseOver()
    {
        if (!isOver && gameBoard.GetStatusOnWakeUp())
        {
            for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
            {
                if (transform.parent.name == "Player" + i + "Avatar")
                {
                    if (i == 6 && gameBoard.CheckIfVotePhase())
                    {

                    }
                    else
                    {
                        playerInfo = Instantiate(playerInfoBox, positions.GetPlayerInfoPosition(i - 1), Quaternion.identity) as GameObject;
                        playerInfo.name = "RoundInfo";
                        playerInfo.transform.SetParent(GameObject.Find("Interaction").transform, false);

                        DisplayCorrectRank(i);

                        if (i == 5 || i == 6 || i == 7)
                        {
                            GameObject.Find("RoundInfo").GetComponent<Animator>().SetBool("top", false);
                        }
                        else
                        {
                            GameObject.Find("RoundInfo").GetComponent<Animator>().SetBool("top", true);
                        }
                        GameObject.Find("PlayerNameText").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i - 1).ToString();
                        if (mockStats.GetActivePlayer() == i)
                        {
                            GameObject.Find("PlayerRoleText").GetComponent<TextMeshProUGUI>().text = "Guesser";
                        }
                        else
                        {
                            GameObject.Find("PlayerRoleText").GetComponent<TextMeshProUGUI>().text = "Clue Giver";
                        }
                    }
                }
                isOver = true;
            }
        }
    }

    void OnMouseExit()
    {
        Destroy(GameObject.Find("RoundInfo"));
        isOver = false;
    }

    private void DisplayCorrectRank(int i)
    {
        int score = mockStats.getScoreListEntry(i-1);
        if (i == 5 || i == 6 || i == 7)
        {
            if (score < 100)
            {
                rank = Instantiate(rank0, new Vector3(70, -10, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else if (score < 200)
            {
                rank = Instantiate(rank1, new Vector3(70, -10, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else if (score < 300)
            {
                rank = Instantiate(rank2, new Vector3(70, -10, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else if (score < 400)
            {
                rank = Instantiate(rank3, new Vector3(70, -10, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else
            {
                rank = Instantiate(rank4, new Vector3(70, -10, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
        }
        else
        {
            if (score < 100)
            {
                rank = Instantiate(rank0, new Vector3(70, 12, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else if (score < 200)
            {
                rank = Instantiate(rank1, new Vector3(70, 12, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else if (score < 300)
            {
                rank = Instantiate(rank2, new Vector3(70, 12, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else if (score < 400)
            {
                rank = Instantiate(rank3, new Vector3(70, 12, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
            else
            {
                rank = Instantiate(rank4, new Vector3(70, 12, 0), Quaternion.identity) as GameObject;
                rank.name = "PlayerRank";
                rank.transform.SetParent(GameObject.Find("RoundInfo").transform, false);
            }
        } 
    }
}
