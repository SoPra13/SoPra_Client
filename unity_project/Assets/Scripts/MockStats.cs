﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using UnityEngine.UI;
using System;

public class MockStats : MonoBehaviour
{
    //Possible Bugs later on:
    //currentTopic needs to be = "" in the beginning of Phase 10 so that unity can check if it has been set or not. I have to set it to "" at the end of a round


    //Call to react to catch PlayerInfo [names,avatars] --> will trigger ReactSetPlayerNames and ReactSetPlayerAvatars in this Script by React
    [DllImport("__Internal")]
    private static extern void FetchPlayerInfo();

    [DllImport("__Internal")]
    private static extern void SendTopicInput(int topic);

    [DllImport("__Internal")]
    private static extern void FetchPlayerMadeTopicChoice(); //active player only, checks which player has already chosen his topic


    private Rounds rounds;
    private int playerPosition;
    private int playerTotal;
    private int activePlayer;
    private int connectedPlayers;
    //In here, each Field represents a Topic (Field 0 = Topic 1; Field 1 = Topic 2). Each Field contains an integer value
    //indicating how many votes this Topic has [0,2,0,1,0] means that Topic 2 has 2 votes, Topic 4 has 1 vote, thre rest has 0 votes
    private int[] topicChoices = { 0, 0, 0, 0, 0 }; //Displays the amount of votes per Topic
    private bool inputLocked = false;
    private string currentTopic = "justATest";

    private int[] topicChoiceMade = { 0, 0, 0, 0, 0, 0, 0 }; //this array comes from Backend, 0 = not chosen a topic yet; 1 = chosen a topic yet; index 0 = player pos 1 etc.
    private string[] names = { "Chris", "Thanh", "Marc", "Ivan", "Simon", "Rambo", "E.T." };
    private int[] avatar = { 1, 2, 3, 4, 5, 6, 7 };
    string[] input = { null, null, null, null, null, null, null };
    string[] topicArray = { "Fever", "River", "Candy", "Rainbow", "Hammer", "Wrench", "Zebra", "Ivy", "Airplane", "Bridge",
        "Frost", "Lollipop", "Parachute", "Day", "Hammer", "Witch", "Lasso", "Burger", "Lotto Ticket", "Worm",
        "Fire", "Grass", "Parot", "Fear", "Hammer", "Giraffe", "Painting", "Train", "Star", "Cricket",
        "Wave", "Bench", "Comedy", "Monster", "Baby", "Wrench", "Piano", "Laptop", "Singer", "Wasp",
        "Roach", "Dog", "Sand", "Swamp", "Face", "Wrench", "Flute", "PC", "Villa", "Bee",
        "Gun", "Cat", "Night", "Fire", "Iron", "Wrench", "Tears", "Mobilephone", "Tree", "Snake",
        "Stone", "Hero", "Lasergun", "Ladybug", "Spike"};


    // Start is called before the first frame update
    void Start()
    {
        activePlayer = 5;
        playerPosition = 7; //REACTINPUT, this value needs to come from React
        playerTotal = 7; // REACTINPUT, this value needs to come from React
        connectedPlayers = 0; //REACTINPUT, this value needs to come from React
    }


    public string GetName(int i)
    {
        return names[i];
    }


    public int GetAvatar(int i)
    {
        return avatar[i];
    }


    public int GetTotalNumberOfPlayers()
    {
        return playerTotal;
    }


    public int GetPlayerPosition()
    {
        return playerPosition;
    }


    public void SetPlayerPosition(int i)
    {
        playerPosition = i;
    }


    public void SetPlayerTotal(int i)
    {
        playerTotal = i;
    }


    public string[] GetTopicArray()
    {
        return topicArray;
    }


    public void SetConnectedPlayers() //this is +1 just for testing, afterwards it needs to pull this number from react
    {
        connectedPlayers += 1;
    }


    public int GetConnectedPlayers()
    {
        return connectedPlayers;
    }


    public int GetActivePlayer()
    {
        return activePlayer;
    }


    public int[] GetTopicChoices()
    {
        return topicChoices;
    }


    //just for Testing Buttons
    public void PlayerHasChosenTopic(int playerPos)
    {
        topicChoiceMade[playerPos] = 1;
    }


    public int[] GetTopicChoiceMade()
    {
        return topicChoiceMade;
    }


    //this function will send the topic out to React. React will take the topic number and increment this topic number by +1 in the backend for this game
    public void SetPlayerTopicInput(int i) //i is either 0,1,2,3 or 4
    {
        if (inputLocked)
        {

        }
        else
        {
            
            try { SendTopicInput(i); }
            catch (EntryPointNotFoundException e)
            {
                Debug.Log("Unity could not send any Topic Output to React" + e);
            }
            topicChoices[i]++; //JUST FOR TESTING
            inputLocked = true;
        }
    }


    public void TESTINGsetTopicInputArray()
    {
        topicChoices[0] = 0;
        topicChoices[1] = 2;
        topicChoices[2] = 1;
        topicChoices[3] = 2;
        topicChoices[4] = 0;
    }


    public void UnlockInputForTopics()
    {
        inputLocked = false;
    }

    public bool GetLockInputTopicState()
    {
        return inputLocked;
    }


    public string GetCurrentTopic()
    {
        return currentTopic;
    }


    //This is called by react after player has connected
    public void ReactSetPlayerStats(string playerStats)
    {
        activePlayer = (int)Char.GetNumericValue(playerStats[0]);
        playerTotal = (int)Char.GetNumericValue(playerStats[1]);
        playerPosition = (int)Char.GetNumericValue(playerStats[2]);
        connectedPlayers = (int)Char.GetNumericValue(playerStats[3]);

        try { FetchPlayerInfo(); }//This is triggered after React Set the above values (every second) and will set PlayerNames and PlayerAvatars
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Could not Fetch any Info " + e);
        }
    }

    //This is called by react after ReactSetPlayerStats has been called
    //PlayerString is separated with ;
    //Player with Position 1 has entry 0 in the String
    //Ex. Thanh;Chris;Simon;Marc  Thanh is name of Player Pos 1, Chris is name of Player Pos 2, etc
    public void ReactSetPlayerNames(String playerNames)
    {
        char[] separator = { ';' };
        string[] nameList = playerNames.Split(separator, StringSplitOptions.None);
        for(int i = 0; i < playerTotal; i++)
        {
            names[i] = nameList[i];
        }
    }

    //This is called by react after ReactSetPlayerStats has been called
    //Input is a string of integers, wherease pos 0 is Avatar number of player 1
    //Ex. Input: "1342", 1 is the avatar number of playyer 1, 3 is the avatar number of player 2
    public void ReactSetPlayerAvatars(string playerAvatars)
    {
        for (int i = 0; i < playerTotal; i++)
        {
            avatar[i] = (int)Char.GetNumericValue(playerAvatars[i]);
        }
    }

    //This is called by react after ReactSetPlayerStats has been called
    //Only needs to be called once
    //topicString is separated with ; delimiter
    //Example Rainbow;Lake;River;
    //TopicString needs to contain 65 topics, thus has 64 delimiters ";"
    public void ReactSetTopicArray(string topicString)
    {
        char[] separator = { ';' };
        string[] topicList = topicString.Split(separator, StringSplitOptions.None);

        for (int i = 0; i < 65; i++)
        {
            topicArray[i] = topicList[i];
        }
    }


    //React will send the Topic of this round via this function
    public void ReactSetThisRoundsTopic(string thisRoundsTopic)
    {
        rounds = GameObject.Find("Rounds").GetComponent<Rounds>(); //needs to be called here because else it calls it in the first scene
        currentTopic = thisRoundsTopic;
        rounds.SetRoundPhase(11);
    }


    //React will send a String containing information about which player has already chosen his topic
    //1 = has chosen; 0 = has not chosen yet
    //ex. 100101: Player Pos. 1 & 4 & 6 have chosen, Player Pos. 2 & 3 & 5 have not yet chosen
    public void ReactSetPlayerHasChosenTopic(string playerChosenString)
    {
        for (int i = 0; i < playerTotal; i++)
        {
            if(i+1 == activePlayer)
            {

            }
            else
            {
                topicChoiceMade[i] = (int)Char.GetNumericValue(playerChosenString[i]);
            }
        }
    }


    //This is called by react after player has connected
    public void GetPlayerHaveChosenTopicFromReact()
    {
        try { FetchPlayerMadeTopicChoice(); }//This is triggered after React Set the above values (every second) and will set PlayerNames and PlayerAvatars
        catch (EntryPointNotFoundException e)
        {
            Debug.Log("Could not get any Infos about Players who made Topic Choices " + e);
        }
    }


    //This is called by react to update the Round value (round can be 0 - 12 (0 for round 1))
    public void ReactSetRound(int round)
    {
        rounds.SetRound(round);
    }


    //This Function is called by React and gets a string as input. Each index of the string represents a topic. String has length o5
    //e.g. "02310" meaning topic 1 has 0 votes; topic 2 has 2 votes; topic 3 has 3 votes; topic 4 has 1 vote; topic 5 has 0 votes
    public void ReactSetTopicVoteList(string topicVoteList)
    {
        for(int i = 0; i < 5; i++)
        {
            topicChoices[i] = (int)Char.GetNumericValue(topicVoteList[i]);
        }
    }


}
