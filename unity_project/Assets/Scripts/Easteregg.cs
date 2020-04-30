using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Easteregg : MonoBehaviour
{
    public GameObject ThanhPilot;
    public GameObject successParticleMachine;
    public AudioSource butterflyBGM;


    private GameObject successParticles;
    private MockStats mockStats;
    private bool randomizer = false;

    void Start()
    {
        successParticles = Instantiate(successParticleMachine, new Vector3(0, -380, -29), Quaternion.Euler(-90, 0, 0)) as GameObject;
        successParticles.name = "SuccessParticles";
        successParticles.transform.SetParent(GameObject.Find("Canvas").transform, false);
        successParticles.SetActive(false);
        mockStats = GameObject.Find("MockStats").GetComponent<MockStats>();
        for (int i = 0; i < mockStats.GetTotalNumberOfPlayers(); i++)
        {
            if (mockStats.GetName(i) == "thanh" || mockStats.GetName(i) == "Thanh")
            {
                butterflyBGM.Play();
                
            }
        }
    }


    void Update()
    {
        if (!randomizer)
        {
            StartCoroutine(EasterEgg());
            randomizer = true;
        }
    }



    public IEnumerator EasterEgg()
    {
        successParticles.SetActive(true);
        yield return new WaitForSeconds(1f);
        GameObject thanh = Instantiate(ThanhPilot, new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        thanh.name = "ThanhPilot";
        thanh.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(9f);
        thanh.SetActive(false);
        successParticles.SetActive(false);
        int randomNumber = Random.RandomRange(0, 10);
        yield return new WaitForSeconds(randomNumber);
        randomizer = false;
    }
}
