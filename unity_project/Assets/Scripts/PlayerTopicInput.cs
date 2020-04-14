﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using TMPro;

public class PlayerTopicInput : MonoBehaviour
{
    public MockStats mockStats;
    public AudioSource buttonPressSFX;
    public AudioSource denySFX;
    public GameObject blockTextObject;

    void Start()
    {
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
    }

    public void PressTopicButton()
    {
        if (mockStats.GetLockInputTopicState())
        {
            GameObject.Find("DenySFX").GetComponent<AudioSource>().Play();
            blockTextObject.SetActive(true);
            StartCoroutine(AlreadyChosen());
        }
        else
        {
            GameObject.Find("ButtonSFX").GetComponent<AudioSource>().Play();
        }

        //Achtung, this.name[11] ist vom Type Char, parsing mit -49 (ASCII CODE)
        mockStats.SetPlayerTopicInput(this.name[11]-49);
    }

    IEnumerator AlreadyChosen()
    {
        yield return new WaitForSeconds(1.5f);
        blockTextObject.SetActive(false);
    }
}