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


    private MockStats mockStats;
    // Start is called before the first frame update
    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }


    //triggers when player clicks the submit button
    //IMPORTANT TODO: Set this player in the backend to clueSubmitted = true
    public void SubmitMysterWord()
    {
        if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition()) //this happens when the active player submits his guess
        {
            string misteryWord = GameObject.Find("ClueInputField").GetComponent<TMP_InputField>().text;

            if (Regex.IsMatch(misteryWord, @"^[a-zA-Z]+$"))
            {         
                GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", true);
                StartCoroutine(SetMisteryWordBoxInactive());
                GameObject.Find("ButtonSFX").GetComponent<AudioSource>().Play();

                if (misteryWord.ToLower() == mockStats.GetCurrentTopic().ToLower()) //check if the guess is correct
                {
                    Debug.Log("You guessed correclty"); //TODO ANIMATION
                    GameObject.Find("Rounds").GetComponent<Rounds>().SetRoundPhase(20);
                }
                else
                {
                    Debug.Log("Your guess was wrong"); //TODO ANIMATION
                    GameObject.Find("Rounds").GetComponent<Rounds>().SetRoundPhase(21);
                }
            }
            else
            {
                GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
            }
        }
        else
        {
            string guessWord = GameObject.Find("ClueInputField").GetComponent<TMP_InputField>().text;

            //Check if input is only 1 word and it is only alphabetic
            if (Regex.IsMatch(guessWord, @"^[a-zA-Z]+$"))
            {
                if (guessWord != mockStats.GetCurrentTopic()) //check that input is not equal to topic
                {
                    GameObject.Find("ButtonSFX").GetComponent<AudioSource>().Play();
                    try { SendClueToReact(guessWord); }//This will send the clue to React. IMPORTANT, also has to tell backend that this player submitted
                    catch (EntryPointNotFoundException e)
                    {
                        Debug.Log("Unity wants to send the mistery word but failed " + e);
                    }
                    GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", true);
                    GameObject.Find("Rules").GetComponent<Animator>().SetBool("disappear", true);
                    StartCoroutine(SetMisteryWordBoxInactive());
                }
            }
            else
            {
                GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
            }
        }
    }


    IEnumerator SetMisteryWordBoxInactive()
    {
        yield return new WaitForSeconds(2f);
        GameObject.Find("MisteryWordInput").GetComponent<Animator>().SetBool("disappear", false);
        GameObject.Find("MisteryWordInput").SetActive(false);

        if (mockStats.GetActivePlayer() == mockStats.GetPlayerPosition()) //this happens when the active player submits his guess
        {

        }
        else
        {
            GameObject.Find("Rules").GetComponent<Animator>().SetBool("disappear", false);
            GameObject.Find("Rules").SetActive(false);
            GameObject.Find("Rounds").GetComponent<Rounds>().SetRoundPhase(15);
        }
        

    }
}
