using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UX_RoundInfo : MonoBehaviour
{
    public GameObject roundInfoBox;


    private bool isOver = false;

    void Start()
    {

    }

    void OnMouseOver()
    {
        if (!isOver)
        {
            GameObject roundInfo = Instantiate(roundInfoBox, new Vector3(-564f, -100f, 0), Quaternion.identity) as GameObject;
            roundInfo.name = "RoundInfo";
            roundInfo.transform.SetParent(GameObject.Find("Canvas").transform, false);
            GameObject.Find("CurrentRound").GetComponent<TextMeshProUGUI>().text = "Current Round: " + GameObject.Find("Rounds").GetComponent<Rounds>().GetRound().ToString();
            GameObject.Find("CorrectCards").GetComponent<TextMeshProUGUI>().text = "Rounds won: " + GameObject.Find("MockStats").GetComponent<MockStats>().GetNumberOfRoundsWon().ToString();
            GameObject.Find("Wrong Guesses").GetComponent<TextMeshProUGUI>().text = "Rounds lost: " + GameObject.Find("MockStats").GetComponent<MockStats>().GetNumberOfRoundsLost().ToString();
            isOver = true;
        }
    }

    void OnMouseExit()
    {
        Destroy(GameObject.Find("RoundInfo"));
        isOver = false;
    }
}
