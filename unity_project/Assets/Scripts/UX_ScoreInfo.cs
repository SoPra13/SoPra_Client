using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UX_ScoreInfo : MonoBehaviour
{
    public GameObject ScoreInfoBox;
    private MockStats mockStats;
    private Positions positions;


    private bool isOver = false;
    private GameObject scoreInfoBox;

    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
        positions = GameObject.Find("PositionManager").GetComponent<Positions>();
    }

    void OnMouseOver()
    {
        if (!isOver)
        {
            for(int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
            {
                if (transform.parent.name == "Player" + i + "Bar")
                {
                    scoreInfoBox = Instantiate(ScoreInfoBox, positions.GetScoreInfoPosition(i - 1), Quaternion.identity) as GameObject;
                    scoreInfoBox.name = "ScoreInfo";
                    scoreInfoBox.transform.SetParent(GameObject.Find("Canvas").transform, false);
                    GameObject.Find("CorrectGuessNr").GetComponent<TextMeshProUGUI>().text = mockStats.GetCorrectGuessesList(i - 1).ToString();
                    GameObject.Find("DuplicateCluesNr").GetComponent<TextMeshProUGUI>().text = mockStats.GetDuplicatedCluesList(i - 1).ToString();
                    GameObject.Find("CorrectCluesNr").GetComponent<TextMeshProUGUI>().text = mockStats.GetCorrectCluesList(i - 1).ToString();
                }
                else
                {

                }
            }

            isOver = true;
        }
    }

    void OnMouseExit()
    {
        Destroy(GameObject.Find("ScoreInfo"));
        isOver = false;
    }
}
