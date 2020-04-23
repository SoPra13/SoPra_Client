//Unity Component in here
import React from 'react';
import styled from 'styled-components';
import User from "../shared/models/User";
import { BaseContainer } from '../../helpers/layout';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import Unity, { UnityContent } from "react-unity-webgl";
import { api, handleError } from '../../helpers/api';

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: block;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  height: 200px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 5px;
  background: none;
  border-style: solid;
  border-width: 2px;
  border-color: white;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: block;
  justify-content: center;
  margin-top: 20px;
`;
//test
export class UnityGame extends React.Component {
    async;


    constructor(props) {
        super(props);
        this.state = {
            lobbyToken: localStorage.getItem('lobbyToken'),
            userToken: localStorage.getItem('userToken'),
            gameToken: localStorage.getItem('gameToken'),
            game: null,
            name: null,
            username: null,
            started: false,
            totalPlayers: 3, //has to be fetched from the backend, 3 is the default value
            playersJoined: 0, //used to communicate with unity
            topic: 0
        };

        //unityContent is our unity code accessor
        this.unityContent = new UnityContent(
            "unity_project_build/Build.json",
            "unity_project_build/UnityLoader.js"
        );

        this.unityContent.on("ComTest", score =>{
            console.log("Es funzt!" + score);
        });

        //!!

        this.unityContent.on("PlayerHasConnected", () =>{
            console.log("PlayerHasConnected");

            this.setPlayerArray(this.state.game);

        });

        this.unityContent.on("SendTopicInput", (topic) =>{
            console.log("Unity has send topic input at position: " + topic);
            this.voteForTopic(topic)

            //this int represents the choice a player made and ranges from 0 to 4
            //For example 3 meaning a player has voted for topic 4; 0 meaning a player has voted for topic 1
        });

        this.unityContent.on("FetchPlayerInfo", () =>{
            this.setPlayerNames(this.state.game);
            this.setPlayerAvatars(this.state.game);
            this.setTopics(this.state.game);
            console.log("FetchingPlayerInfos");
        });

        //In here, React has to call the backend to get the topic from the topic array for this round
        //the back end has to handle the edge cases of
        //1. there are ties among the votes (ex. topic 1 has 2 votes and topic 2 has 2 votes)
        //2. No votes have been given (all have 0 votes but time is up)
        //Then, this function will send the final chosen topic back to unity via sendRoundsTopic()
        //Todo not yet implemented correctly --> Backend has to handle edge cases
        this.unityContent.on("TopicsHaveBeenChosen", () =>{
            this.sendRoundsTopic(this.state.game);
            console.log("The Topics for this Round have been chosen");
        });


        this.unityContent.on("AskForRound", () =>{
            //Todo fetch round number from backend and pass it to sendRoundNumber
            this.sendRoundNumber(this.state.game);
            console.log("Unity asks React for the current Round");
        });


        this.unityContent.on("FetchPlayerMadeTopicChoice", () =>{
            this.sendPlayerHasChosenTopicInfo(this.state.game);
            console.log("Unity asks for the info about which player has already chosen his topic");
        });


        //This is triggered by unity all 0.5 seconds
        //This has to return the current topic votes to unity
        this.unityContent.on("CallsForTopicList", () =>{
            this.sendTopicList(this.state.game);
            console.log("Unity asks for the List of voted topics");
        });


        this.unityContent.on("CallsForLeaveGame", () =>{
            //Todo handle a leaving player
            console.log("A player wants to leave the game");
        });


        this.unityContent.on("SendGuessToReact", (message) =>{
            //Todo handle the misteryword with Backend API
            console.log("A player sent a mistery word: " + message);
        });
    }


    async setPlayerArray(game) {
        const response = await api.put('/game/ready?userToken=' + localStorage.getItem('userToken') +
            '&gameToken=' + localStorage.getItem('gameToken'))

        console.log(game);

        var playerIndex = this.getIndex(game, localStorage.getItem('userToken'));

        var activePlayer = game.guesser+1;

        var totalPlayer = game.playerList.length + game.botList.length;

        var ready = game.botList.length;

        for (var i = 0; i<game.playerList.length; i++) {
            if (game.playerList[i].unityReady == true) {
                ready += 1;
            }
        }

        console.log(activePlayer);
        console.log(totalPlayer);
        console.log(playerIndex);
        console.log(ready);

        var str = '';
        str= (activePlayer.toString()+ totalPlayer.toString()+ playerIndex.toString()+ ready.toString());

        console.log(activePlayer.toString()+totalPlayer.toString());
        console.log(str)

        this.setPlayerStats(str);
    }

    setPlayers(){
        this.unityContent.send(
            "PlayerTotal",
            "SetPlayerTotal",
            this.state.totalPlayers
        )
    }

    substringOfWordList(str){
        var res = str.split(";");
        return res;
    }

    arrayToString(array){
        var begin = array[0];
        for (let i = 1; i < array.length; i++){
            begin += ";"+array[i]
        }
    }

    stringToArray(str){
        let array = [];
        for (let i = 0; i < str.length; i++){
            array.push(parseInt(str.charAt(i)));
        }
        return array;
    }

    getIndex(game, token){
        console.log(token);
        for(var i = 0; i<game.playerList.length; i++){
            console.log(game.playerList[i].token)
            if(token == game.playerList[i].token){
                return i+1;

            }
        }
    }




    addPlayer(){
        this.unityContent.send(
            "PlayerTotal",
            "SetPlayerCount",
            4
        )
    }

    setPlayerStats(playerStats){ //activePlayer;playerTotal;playerPosition;connectPlayers
        let infoString = playerStats;//i.e. "1726" String
        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerStats",
            infoString
        )
    }

    setPlayerNames(game){ //Send a string with a ";" delimiter to unity

        let nameString = game.playerList[0].username;
        for (var i = 1; i<game.playerList.length; i++) {
            nameString += ';'+game.playerList[i].username;
        }

       /* for (var i = 1; i<game.botList.length; i++) {
            nameString += ';'+game.botList[i].botname;
        }*/


        console.log("Names Set Completed");
        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerNames",
            nameString //Todo This are just dummy values, these values need to come from Backend Gameobject BOTS
        )
    }

    setPlayerAvatars(){ //send a string of avatar ids to unity
        let avatarString = "1764325";
        console.log("Avatars Set Completed");
        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerAvatars",
            avatarString //Todo This are just dummy values, these values need to come from Backend Gameobject
        )
    }

    setTopics(game){ //Send a string with a ";" delimiter to unity
        let topicString = this.arrayToString(game.mysteryWords)
        console.log("Topics Set Completed");
        this.unityContent.send(
            "MockStats",
            "ReactSetTopicArray",
            topicString
        )
    }

    //topicArray [0,0,0,1,2], each index represents the number of votes a topic has
    //in this example, topic 4 has 1 vote and topic 5 has 2 votes
    //after having received the Topic List from the backend, send it as string to unity
    sendTopicList(game){
        //let topicListString = this.arrayToString(game.voteList) //Todo just4testing
        let topicListString = "02001"
        this.unityContent.send(
            "MockStats",
            "ReactSetTopicVoteList",
            topicListString
        )
    }

    //React will send the chosen topic for this round back to unity
    sendRoundsTopic(game){
        console.log("sending back the topic to unity");
        //let topic = game.topic; //todo just4testing
        let topic = "Animal Crossing"
        this.unityContent.send(
            "MockStats",
            "ReactSetThisRoundsTopic",
            topic
        )
    }


    //The round number is an int  in Range [0,12]; 0 = round 1; 12 = round 13
    sendRoundNumber(game){
        console.log("sending back the current Round to unity");
        let round = game.currentRound;
        this.unityContent.send(
            "MockStats",
            "ReactSetRound",
            round
        )
    }


    //Send a string to unity containing info about which player has already chosen his topic
    //1 = has chosen; 0 = has not yet chosen
    //ex. 100101: Player Pos. 1 & 4 & 6 have chosen, Player Pos. 2 & 3 & 5 have not yet chosen
    sendPlayerHasChosenTopicInfo(game){
        console.log("sending back info about which player has already chosen a Topic to Unity");

        var votedString = ''
        for (var i = 0; i<game.playerList.length; i++) {
            if(game.playerList[i].voted == true){
            votedString += '1'
        }else {
                votedString += '0'
            }
        }

        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerHasChosenTopic",
            votedString
        )
    }


    async currentGame(){
        try{
        const response = await api.get('/game?token=' + localStorage.getItem('gameToken'));

        var game = response.data;
        console.log(game);
            console.log(response);

        this.setState({
            game: game,
        })
            console.log(this.state.game);
    } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
}


    async voteForTopic(topic){
        try{
        //topic int 0 by default
         const response = await api.put('/game/vote?gameToken=' + this.state.gameToken + '&userToken=' + localStorage.getItem('userToken') +'&topic=' + topic);

    } catch (error) {
        alert(`Something went wrong when trying to set the vote: \n${handleError(error)}`);
    }
    }

    componentWillMount() {
        this.setState({
            game: this.currentGame(),
        })

    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.currentGame(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label><b>Unity React Control-Room</b></Label>
                        <ButtonContainer>
                            <Label> Force Connect Users: <br/> </Label>
                            <Button
                                width="15%"
                                onClick={() => {
                                    this.setState({totalPlayers: this.state.totalPlayers +1});
                                    console.log(this.state.totalPlayers)
                                }}
                            >
                                AddToTotal
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    this.addPlayer();
                                }}
                            >
                                SetPlayers
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    console.log(this.state.score)
                                }}
                            >
                                Check If Unity Talks
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    //send to unity
                                }}
                            >
                                P4-Connect
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    //send to unity
                                }}
                            >
                                P5-Connect
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    //send to unity
                                }}
                            >
                                P6-Connect
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>

                <div
                    style={{
                        position: "center",
                        top: 0,
                        left: 0,
                        width: "1080px",
                        height: "600px"
                    }}
                >
                    <Unity unityContent={this.unityContent} height="768px" width ="1366px" />
                </div>
                <br/>
            </BaseContainer>
        );
    }
}


export default withRouter(UnityGame);
