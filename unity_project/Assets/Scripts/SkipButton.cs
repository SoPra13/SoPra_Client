﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using System;

public class SkipButton : MonoBehaviour
{
    public GameObject skipText;

    private bool isOver = false;
    private bool waitForSkip = false;
    private MockStats mockStats;

    [DllImport("__Internal")]
    private static extern void TellReactToSkip();


    public void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    public void ClickSkip()
    {
        if (waitForSkip)
        {

        }
        else
        {
            try { TellReactToSkip(); }
            catch (EntryPointNotFoundException e)
            {
                Debug.Log("Unity wants to tell React that the round has been skipped " + e);
            }

            GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
            GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", true);
            GameObject.Find("SkipButton").GetComponent<Animator>().SetBool("disappear", true);
            Destroy(GameObject.Find("SkipText"));
            GameObject.Find("CluesBGTemp").GetComponent<Animator>().SetBool("disappear", true);
            Destroy(GameObject.Find("Placeholder"));
            mockStats.NotifyReactToEvaluateTheRound();
            StartCoroutine(SetMisteryWordBoxInactive());
            waitForSkip = true;
        }
    }

    void OnMouseOver()
    {
        if (!isOver)
        {
            GameObject sText = Instantiate(skipText, new Vector3(-100f, -84f, 0), Quaternion.identity) as GameObject;
            sText.name = "SkipText";
            sText.transform.SetParent(GameObject.Find("Interaction").transform, false);
            isOver = true;
        }
    }

    void OnMouseExit()
    {
        Destroy(GameObject.Find("SkipText"));
        isOver = false;
    }


    IEnumerator SetMisteryWordBoxInactive()
    {
        GameObject.Find("Rounds").GetComponent<Rounds>().SetSkippingTurn();
        yield return new WaitForSeconds(0.1f);
        GameObject.Find("TimerScript").GetComponent<Timer>().DeactivateTimer();
        yield return new WaitForSeconds(2f);
        GameObject.Find("CluesBGTemp").GetComponent<Animator>().SetBool("disappear", false);
        GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", false);
        GameObject.Find("SkipButton").GetComponent<Animator>().SetBool("disappear", false);
        Destroy(GameObject.Find("MisteryWordInput"));
        Destroy(GameObject.Find("CluesBGTemp"));
        Destroy(GameObject.Find("SkipButton"));
        waitForSkip = false;
    }
}
