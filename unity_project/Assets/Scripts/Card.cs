using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Card : MonoBehaviour
{
    private string[] topics;
    private int cardId;

    public Card(int cardNr)
    {
        cardId = cardNr;
    }


    public void setTopics(string[] topicArray)
    {
        topics = topicArray;
    }

    public string[] getTopics()
    {
        return topics;
    }

    public int getCardId()
    {
        return cardId;
    }

}
