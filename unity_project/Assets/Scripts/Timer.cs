using System.Collections;
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
    private bool timerStatus;

    private int timeLeft = 0;

    void Start()
    {
        
    }


    public void StartTimer(int timeInSeconds)
    {
        interrupt = false;
        timerStatus = true;
        StartCoroutine(TimerRuns(timeInSeconds));
    }

    public void DeactivateTimer()
    {
        interrupt = true;
    }

    public bool getTimerStatus()
    {
        return timerStatus;
    }


    public int GetTime()
    {
        return timeLeft;
    }


    IEnumerator TimerRuns(int timeInSeconds)
    {
        timeLeft = timeInSeconds;
        for(int time = timeInSeconds; time >= 0; time--)
        {
            timeLeft = time;
            if (time != 0)
            {
                timeNumber = Instantiate(numbers[time - 1], new Vector3(476f, 278.7f, 0), Quaternion.identity) as GameObject;
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
            if (time != 0 && time != -1 && !interrupt) { yield return new WaitForSeconds(0.25f); }
            if (time <= 3 && time != -1 && !interrupt) { clockTick.Play(); }
            if (time != 0 && time != -1 && !interrupt) { yield return new WaitForSeconds(0.25f); }
            if (time <= 10 && time != -1 && !interrupt || time <= 3 && time != -1 && !interrupt) { clockTick.Play(); }
            if (time != 0 && time != -1 && !interrupt) { yield return new WaitForSeconds(0.25f); }
            if (time <= 3 && time != -1 && !interrupt) { clockTick.Play(); }
            if (time != 0 && time != -1 && !interrupt) { yield return new WaitForSeconds(0.25f); }
            if (time != 0 && time != -1 && !interrupt)
            {
                clockTick.Play();
            }
            else if(time == 0)
            {
                timeOver.Play();
            }
            Destroy(timeNumber);
        }
        timerStatus = false;
    }
}
