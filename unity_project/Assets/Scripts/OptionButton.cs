using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using System;

public class OptionButton : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void CallsForLeaveGame();


    private Animator OptionIconButton;
    private Animator ExitText;
    private Animator ToogleText;
    private Animator LeaveToogle;
    private Animator MusicToogle;
    private Animator OptionBG;

    private bool hasBeenPressed = false;
    private bool musicToogle = true;

    private AudioSource optionMenuSFX;
    private AudioSource bgmMusic;
    // Start is called before the first frame update
    void Start()
    {
        GameObject.Find("OptionMenuCanvas").GetComponent<Canvas>().worldCamera = GameObject.Find("Main Camera").GetComponent<Camera>();
        optionMenuSFX = GameObject.Find("OptionSFX").GetComponent<AudioSource>();
        OptionIconButton = GameObject.Find("OptionIconButton").GetComponent<Animator>();
        ExitText = GameObject.Find("ExitText").GetComponent<Animator>();
        ToogleText = GameObject.Find("ToogleText").GetComponent<Animator>();
        LeaveToogle = GameObject.Find("LeaveToogle").GetComponent<Animator>();
        MusicToogle = GameObject.Find("MusicToogle").GetComponent<Animator>();
        OptionBG = GameObject.Find("OptionBG").GetComponent<Animator>();

        bgmMusic = GameObject.Find("bgm").GetComponent<AudioSource>();
    }

    public void OptionButtonPressed()
    {
        optionMenuSFX.Play();
        if (!hasBeenPressed)
        {
            OptionBG.SetBool("disappear", false);
            ExitText.SetBool("disappear", false);
            LeaveToogle.SetBool("disappear", false);
            ToogleText.SetBool("disappear", false);
            MusicToogle.SetBool("disappear", false);
            OptionBG.SetBool("wake", true);
            ExitText.SetBool("wake", true);
            LeaveToogle.SetBool("wake", true);
            ToogleText.SetBool("wake", true);
            MusicToogle.SetBool("wake", true);
            hasBeenPressed = true;
        }
        else
        {
            OptionBG.SetBool("wake", false);
            ExitText.SetBool("wake", false);
            LeaveToogle.SetBool("wake", false);
            ToogleText.SetBool("wake", false);
            MusicToogle.SetBool("wake", false);
            OptionBG.SetBool("disappear", true);
            ExitText.SetBool("disappear", true);
            LeaveToogle.SetBool("disappear", true);
            ToogleText.SetBool("disappear", true);
            MusicToogle.SetBool("disappear", true);
            hasBeenPressed = false;
        }
    }

    public void MusicTooglePressed()
    {
        if (musicToogle)
        {
            MusicToogle.SetBool("clicked", true);
            bgmMusic.volume = 0f;
            musicToogle = false;
        }
        else
        {
            MusicToogle.SetBool("clicked", false);
            bgmMusic.volume = 0.5f;
            musicToogle = true;
        }
    }


    public void LeaveGameButtonPressed()
    {
        try { CallsForLeaveGame(); }
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Player wanted to leave game failed " + e);
        }
    }
}
