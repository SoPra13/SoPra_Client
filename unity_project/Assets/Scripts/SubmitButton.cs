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
    private static extern void SendGuessToReact(string message);


    private MockStats mockStats;
    // Start is called before the first frame update
    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    public void SubmitMysterWord()
    {
        string guessWord = GameObject.Find("PlayerInput").GetComponent<TMP_InputField>().text;

        //Check if input is only 1 word and it is only alphabetic
        if(Regex.IsMatch(guessWord, @"^[a-zA-Z]+$"))
        {
            if (guessWord != mockStats.GetCurrentTopic()) //check that input is not equal to topic
            {
                GameObject.Find("ButtonSFX").GetComponent<AudioSource>().Play();
                try { SendGuessToReact(guessWord); }//This will send the mistery Word to React
                catch (EntryPointNotFoundException e)
                {
                    Debug.Log("Unity wants to send the mistery word but failed " + e);
                }
                GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", true);
                StartCoroutine(SetMisteryWordBoxInactive());
            }
        }
    }


    IEnumerator SetMisteryWordBoxInactive()
    {
        yield return new WaitForSeconds(2f);
        GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", false);
        GameObject.Find("MisteryWordInput").SetActive(false);
        GameObject.Find("Rounds").GetComponent<Rounds>().SetRoundPhase(15);
    }

}
