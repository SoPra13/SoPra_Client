using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using TMPro;
using System;

public class GameOverEvaluation : MonoBehaviour
{
    public GameObject mainPlayerBar;
    public GameObject otherPlayerBar;
    public GameObject mainPlayerFrame;
    public GameObject otherPlayerFrame;

    private Avatars avatars;
    private MockStats mockStats;

    private float x;
    private float y;

    private bool waitForUpdate = false;

    [DllImport("__Internal")]
    private static extern void FetchScores();



    void Start()
    {
        avatars = GameObject.Find("Canvas").GetComponent<Avatars>();
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
        x = 0;
        y = 200f;

        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if(i == mockStats.GetPlayerPosition())
            {
                //Debug.Log("main: "+i);
                GameObject scoreBar = Instantiate(mainPlayerBar, new Vector3(x, y, -5), Quaternion.identity) as GameObject;
                scoreBar.name = "Player" + i + "Bar";
                GameObject.Find("NameText").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i - 1);
                GameObject.Find("NameText").name = "NameTagPlayer" + i;
                GameObject.Find("ScoreText").name = "ScoreTextPlayer" + i;
                GameObject.Find("ScoreNumber").GetComponent<TextMeshProUGUI>().text = mockStats.getScoreListEntry(i - 1).ToString();
                GameObject.Find("ScoreNumber").name = "ScoreNumberPlayer" + i;
                scoreBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
                GameObject.Find("NameTagPlayer" + i).GetComponent<Animator>().SetBool("appear", true);
                GameObject.Find("ScoreTextPlayer" + i).GetComponent<Animator>().SetBool("appear", true);
                GameObject.Find("ScoreNumberPlayer" + i).GetComponent<Animator>().SetBool("appear", true);
            }
            else
            {
                //Debug.Log("off: " + i);
                GameObject scoreBar = Instantiate(otherPlayerBar, new Vector3(x,y,-5), Quaternion.identity) as GameObject;
                scoreBar.name = "Player" + i + "Bar";
                GameObject.Find("NameText").GetComponent<TextMeshProUGUI>().text = mockStats.GetName(i - 1);
                GameObject.Find("NameText").name = "NameTagPlayer" + i;
                GameObject.Find("ScoreText").name = "ScoreTextPlayer" + i;
                GameObject.Find("ScoreNumber").GetComponent<TextMeshProUGUI>().text = mockStats.getScoreListEntry(i-1).ToString();
                GameObject.Find("ScoreNumber").name = "ScoreNumberPlayer" + i;
                scoreBar.transform.SetParent(GameObject.Find("Canvas").transform, false);
                GameObject.Find("NameTagPlayer" + i).GetComponent<Animator>().SetBool("appear",true);
                GameObject.Find("ScoreTextPlayer" + i).GetComponent<Animator>().SetBool("appear", true);
                GameObject.Find("ScoreNumberPlayer" + i).GetComponent<Animator>().SetBool("appear", true);
            }
            y -= 80f;
        }
    }


    void Update()
    {
        if (!waitForUpdate)
        {
            StartCoroutine(WaitForUpdate());
            waitForUpdate = true;
        }
    }


    public IEnumerator WaitForUpdate()
    {
        try { FetchScores(); }//This will tell React to get the Round int for this round
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to get a score update but Failed " + e);
        }
        yield return new WaitForSeconds(0.25f);

        for (int i = 1; i <= mockStats.GetTotalNumberOfPlayers(); i++)
        {
            GameObject.Find("ScoreNumberPlayer" + i).GetComponent<TextMeshProUGUI>().text = mockStats.getScoreListEntry(i-1).ToString();
        }
        waitForUpdate = false;
    }
}
