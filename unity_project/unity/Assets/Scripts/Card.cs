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


    public void SetTopics(string[] topicArray)
    {
        topics = topicArray;
    }

    public string[] GetTopics()
    {
        return topics;
    }

    public int GetCardId()
    {
        return cardId;
    }

}
