﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Timer : MonoBehaviour
{
    public AudioSource clockTick;
    public AudioSource timeOver;

    public GameObject[] numbers = new GameObject[30];

    private bool interrupt = false;
    private GameObject timeNumber;


    void Start()
    {
        
    }


    public void StartTimer(int timeInSeconds)
    {
        StartCoroutine(TimerRuns(timeInSeconds));
    }

    public void DeactivateTimer()
    {
        interrupt = true;
    }


    IEnumerator TimerRuns(int timeInSeconds)
    {
        for(int time = timeInSeconds; time >= 0; time--)
        {
            if (time != 0)
            {
                timeNumber = Instantiate(numbers[time - 1], new Vector3(382.7f, 278.7f, 0), Quaternion.identity) as GameObject;
                timeNumber.name = "TimerNumber";
                timeNumber.transform.SetParent(GameObject.Find("Canvas").transform, false);
            }
            else
            {

            }
            if (interrupt)
            {
                Destroy(timeNumber);
                time = -1;
            }
            if (time != 0 && time != -1) { yield return new WaitForSeconds(0.25f); }
            if (time <= 3 && time != -1) { clockTick.Play(); }
            if (time != 0 && time != -1) { yield return new WaitForSeconds(0.25f); }
            if (time <= 10 && time != -1 || time <= 3 && time != -1) { clockTick.Play(); }
            if (time != 0 && time != -1) { yield return new WaitForSeconds(0.25f); }
            if (time <= 3 && time != -1) { clockTick.Play(); }
            if (time != 0 && time != -1) { yield return new WaitForSeconds(0.25f); }
            if (time != 0 && time != -1)
            {
                clockTick.Play();
            }
            else if(time == 0)
            {
                timeOver.Play();
            }
            Destroy(timeNumber);
        }
        interrupt = false;
    }
}