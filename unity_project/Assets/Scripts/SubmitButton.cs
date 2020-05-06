using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using System;
using System.Text.RegularExpressions;

public class SubmitButton : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void SendClueToReact(string message);

    [DllImport("__Internal")]
    private static extern void SendGuessToReact(string message);


    private MockStats mockStats;
    private bool enterTriggered = false;
    // Start is called before the first frame update
    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    public void Update()
    {
        if (!enterTriggered)
        {
            if (Input.GetKeyDown(KeyCode.Return))
            {
                SubmitMysterWord();
                enterTriggered = true;
            }
        }
    }


    public void SubmitMysterWord()
    {
        if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition()) //this happens when the active player submits his guess
        {
            string misteryWord = GameObject.Find("ClueInputField").GetComponent<TMP_InputField>().text;

            if (Regex.IsMatch(misteryWord, @"^[a-zA-Z]+$"))
            {         
                StartCoroutine(SetMisteryWordBoxInactive(false));
                GameObject.Find("ButtonSFX").GetComponent<AudioSource>().Play();
                try { SendGuessToReact(misteryWord); }
                catch (EntryPointNotFoundException e)
                {
                    Debug.Log("Unity wants to send the guess but failed " + e);
                }
                mockStats.NotifyReactToEvaluateTheRound(); //tell react to check if the round was won or lost
                Destroy(GameObject.Find("SkipButton"));
            }
            else
            {
                GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
            }
            StartCoroutine(PreventEnterSpam());
        }
        else
        {
            string guessWord = GameObject.Find("ClueInputField").GetComponent<TMP_InputField>().text;

            //Check if input is only 1 word and it is only alphabetic
            if (Regex.IsMatch(guessWord, @"^[a-zA-Z]+$"))
            {
                if (guessWord != mockStats.GetCurrentTopic()) //check that input is not equal to topic
                {
                    StartCoroutine(SetMisteryWordBoxInactive(false));
                    GameObject.Find("ButtonSFX").GetComponent<AudioSource>().Play();
                    try { SendClueToReact(guessWord); }//This will send the clue to React. IMPORTANT, also has to tell backend that this player submitted
                    catch (EntryPointNotFoundException e)
                    {
                        Debug.Log("Unity wants to send the clue but failed " + e);
                    }
                    enterTriggered = false;
                }
            }
            else
            {
                GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
            }
            StartCoroutine(PreventEnterSpam());
        }
    }


    //This triggers if the player did not submit anything within 30 seconds
    public void PlayerFailedToSubmit()
    {
        try { SendClueToReact("empty"); }//This will send the clue to React. IMPORTANT, also has to tell backend that this player submitted
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to send the clue but failed " + e);
        }
    }


    //This triggers if the Active player did not submit anything within 30 seconds
    public void ActivePlayerFailedToSubmit()
    {
        try { SendGuessToReact("empty"); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Unity wants to send the guess but failed " + e);
        }
        mockStats.NotifyReactToEvaluateTheRound(); //tell react to check if the round was won or lost
        Destroy(GameObject.Find("SkipButton"));
    }


    public IEnumerator SetMisteryWordBoxInactive(bool timeUp)
    {
        if (timeUp)
        {
            Debug.Log("Submit1");
            GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
        }
        else
        {
            GameObject.Find("Rounds").GetComponent<Rounds>().SetLockDown();
            if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
            {
                mockStats.SetTime(2, GameObject.Find("TimerScript").GetComponent<Timer>().GetTime());
            }
            else
            {
                mockStats.SetTime(1, GameObject.Find("TimerScript").GetComponent<Timer>().GetTime());
            }
            yield return new WaitForSeconds(0.1f);
            GameObject.Find("TimerScript").GetComponent<Timer>().DeactivateTimer();
        }

        if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition())
        {          
            GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", true);
            GameObject.Find("CluesBGTemp").GetComponent<Animator>().SetBool("disappear", true);
            if(GameObject.Find("Placeholder") != null)
            {
                Destroy(GameObject.Find("Placeholder"));
            }
        }
        else
        {
            GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", true);
            GameObject.Find("Rules").GetComponent<Animator>().SetBool("disappear", true);
            if (GameObject.Find("Placeholder") != null)
            {
                Destroy(GameObject.Find("Placeholder"));
            }
        }
        yield return new WaitForSeconds(2f);
        GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", false);
        yield return new WaitForSeconds(0.1f);
        Destroy(GameObject.Find("MisteryWordInput"));


        if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition()) //this happens when the active player submits his guess
        {
            GameObject.Find("CluesBGTemp").GetComponent<Animator>().SetBool("disappear", false);
            Destroy(GameObject.Find("CluesBGTemp"));
        }
        else
        {
            GameObject.Find("Rules").GetComponent<Animator>().SetBool("disappear", false);
            GameObject.Find("Rounds").GetComponent<Rounds>().SetRoundPhase(15);
            Destroy(GameObject.Find("Rules"));
        }
        GameObject.Find("Canvas").GetComponent<GameBoard>().DeactivatePlayerBoxBlocke();
    }


    IEnumerator PreventEnterSpam()
    {
        yield return new WaitForSeconds(0.1f);
        enterTriggered = false;
    }
   
}
