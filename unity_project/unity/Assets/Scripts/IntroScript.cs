using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;

public class IntroScript : MonoBehaviour
{
    public GameObject light;
    public TextMeshProUGUI playerDescripton;
    public GameObject[] avatars;
    public GameObject playerFrame;
    public GameObject ribbon;

    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine(SetUpScene());
    }

    IEnumerator SetUpScene()
    {
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(0.9f);
        GameObject ribbonTop = Instantiate(ribbon, new Vector3(0,240f,1f), Quaternion.identity) as GameObject;
        ribbonTop.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(3f);
        GameObject lightScreen = Instantiate(light, new Vector3(0, 40f, 1f), Quaternion.identity) as GameObject;
        lightScreen.transform.SetParent(GameObject.Find("Canvas").transform, false);
        yield return new WaitForSeconds(1f);
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }

}
