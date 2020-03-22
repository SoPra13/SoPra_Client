using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SetupGameBoard : MonoBehaviour
{
    public GameObject playerBox;
    public GameObject otherPlayers;


    // Start is called before the first frame update
    void Start()
    {
        //just for testing:
        PlayerCounter.playerTotal = 7;
        //Testing variable ends here


        for (int i = 0; i < PlayerCounter.playerTotal; i++)
        {
            
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
