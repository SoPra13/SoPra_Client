using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;
using System.Runtime.InteropServices;
using UnityEngine.UI;
using System;

public class LoadingScreen : MonoBehaviour
{
    //The following part is for React Communication
    [DllImport("__Internal")]
    private static extern void ComTest(int score);

    [DllImport("__Internal")]
    private static extern void PlayerHasConnected();


    public Animator playerJoinedAnimator;
    public Animator p1TextAnimator;
    public Animator p2TextAnimator;
    public Animator ornaTop;
    public Animator ornaBot;
    public Animator spinner;
    public Animator justOneLogo;
    public Animator sfxToogle;

    public AudioSource confirm;
    public AudioSource zap;
    public AudioSource bgMusic;

    public GameObject faderLeft;
    public GameObject faderRight;
    public GameObject particles;
    public GameObject musicToogle;
    public GameObject topicButtonObject;

    public Sprite soundOnIcon;
    public Sprite soundOffIcon;

    public TextMeshProUGUI totalPlayers;
    public TextMeshProUGUI connectedPlayers;

    public MockStats mockStats;

    private bool sentinel = true;
    private bool toogleSound = true;
    private bool reactCall = false;
    private List<Player> playerList = new List<Player>();

    void Start()
    {
        //The following is for unity-react communication testing ComTest Works, leave unchanged!
        //ComTest(666);
        confirm.volume = 0.25f;
        StartCoroutine(ZapDelay());
    }


    // Update is called once per frame
    void Update()
    {
        if (!reactCall) //Will call react every 1 second
        {
            StartCoroutine(ReactCall());
            reactCall = true;
        }
        totalPlayers.text = "/" + mockStats.GetTotalNumberOfPlayers().ToString();
        connectedPlayers.text = mockStats.GetConnectedPlayers().ToString();

        if (mockStats.GetTotalNumberOfPlayers() == mockStats.GetConnectedPlayers())
        {
            if (sentinel)
            {
                StartCoroutine(FadeScreen());
                sentinel = false;
            }
        }
    }


    public void SetPlayerTotal(int total)
    {
        mockStats.SetPlayerTotal(total);
    }


    private void SetPlayerPosition(int pos)
    {
        mockStats.SetPlayerPosition(pos);
    }


    public void ButtonPressed()
    {
        if (toogleSound)
        {
            Image img = musicToogle.GetComponent<Image>();
            img.sprite = soundOffIcon;
            bgMusic.volume = 0f;
            this.toogleSound = false;
        }
        else
        {
            Image img = musicToogle.GetComponent<Image>();
            img.sprite = soundOnIcon;
            bgMusic.volume = 1f;
            this.toogleSound = true;
        }
        
    }


    IEnumerator FadeScreen()
    {
        confirm.Play();
        sfxToogle.SetBool("transition", true);
        ornaBot.SetBool("transition", true);
        ornaTop.SetBool("transition", true);
        playerJoinedAnimator.SetBool("transition", true);
        p1TextAnimator.SetBool("transition", true);
        p2TextAnimator.SetBool("transition", true);
        spinner.SetBool("transition", true);
        justOneLogo.SetBool("transition", true);
        faderLeft.SetActive(true);
        faderRight.SetActive(true);
        StartCoroutine(ParticlesDeactivate());
        StartCoroutine(DecreaseVolume());
        yield return new WaitForSeconds(2f);
        transform.parent = null;
        //transition to next scene
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 2);
    }


    IEnumerator ZapDelay()
    {
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(0.9f);
        zap.volume = 0.5f;
        zap.Play();
    }


    IEnumerator ParticlesDeactivate()
    {
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(1f);
        particles.SetActive(false);
    }


    IEnumerator DecreaseVolume()
    {
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(0.2f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        yield return new WaitForSeconds(0.1f);
        bgMusic.volume -= 0.1f;
        bgMusic.volume -= 0.1f;
    }


    IEnumerator ReactCall() //Will call react every 1 second
    {
        try { PlayerHasConnected(); }//As soon as unity Starts, Unity will tell React that this player heas connected
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("PlayerHasConnected did not work");
        }
        yield return new WaitForSeconds(1f);
        reactCall = false;
    }

}
