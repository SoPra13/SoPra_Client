using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SkipButton : MonoBehaviour
{
    public GameObject skipText;

    private bool isOver = false;

    public void ClickSkip()
    {

    }

    void OnMouseOver()
    {
        if (!isOver)
        {
            Debug.Log("Gib");
            GameObject sText = Instantiate(skipText, new Vector3(-12f, 260f, 0), Quaternion.identity) as GameObject;
            sText.name = "SkipText";
            sText.transform.SetParent(GameObject.Find("Interaction").transform, false);
            isOver = true;
        }
    }

    void OnMouseExit()
    {
        Destroy(GameObject.Find("SkipText"));
        isOver = false;
    }

}
