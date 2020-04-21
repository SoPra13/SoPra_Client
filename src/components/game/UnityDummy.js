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

export class UnityDummy extends React.Component {
  async;

  constructor(props) {
    super(props);
    this.state = {
      lobbyToken: localStorage.getItem('lobbyToken'),
      userToken: localStorage.getItem('userToken'),
      gameToken: localStorage.getItem('gameToken'),
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
      /*this.tryPut();*/
      this.setPlayerStats("1726");
    });




    this.unityContent.on("AskForTopicsList", () =>{
      console.log("Unity asked for the TopicList");
      this.sendTopicList();
      //topicArray [0,0,0,1,2], each index represents the number of votes a topic has
      //in this example, topic 4 has 1 vote and topic 5 has 2 votes
    });

    this.unityContent.on("SendTopicInput", (topic) =>{
      console.log("Unity has send topic input at position: " + topic);
      //todo send this topic int to the backend
      //this int represents the choice a player made and ranges from 0 to 4
      //For example 3 meaning a player has voted for topic 4; 0 meaning a player has voted for topic 1
    });

    this.unityContent.on("FetchPlayerInfo", () =>{
      this.setPlayerNames();
      this.setPlayerAvatars();
      this.setTopics();
      console.log("FetchingPlayerInfos");
    });

    //In here, React has to call the backend to get the topic from the topic array for this round
    //the back end has to handle the edge cases of
    //1. there are ties among the votes (ex. topic 1 has 2 votes and topic 2 has 2 votes)
    //2. No votes have been given (all have 0 votes but time is up)
    this.unityContent.on("TopicsHaveBeenChosen", () =>{
      this.sendRoundsTopic();
      console.log("The Topics for this Round have been chosen");
    });
  }

  async tryPut()
  {
    const response = await api.put('/game/ready?userToken=' + localStorage.getItem('userToken') +
        '&gameToken=' + localStorage.getItem('gameToken'))

    console.log(response)

    var game = response.data;

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

  /*    arrayToString(array){
          var begin = array[1];
          for (let i = 1; i < array.length; i++){
              begin =
          }
      }*/

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
        infoString //Todo This are just dummy values, these values need to come from Backend Gameobject
    )
  }

  setPlayerNames(){ //Send a string with a ";" delimiter to unity
    let nameString = "Baba;Ganoush;Trimotop;Slayer99;Ivan;Boehlen;SonGoku"; //player +  bot names
    console.log("Names Set Completed");
    this.unityContent.send(
        "MockStats",
        "ReactSetPlayerNames",
        nameString //Todo This are just dummy values, these values need to come from Backend Gameobject
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

  setTopics(){ //Send a string with a ";" delimiter to unity
    let topicString = "Group13;WeRock;Database;Sopra;Corona;Wrench;Zebra;Ivy;Airplane;Bridge;Frost;" +
        "Lollipop;Parachute;Day;Sunset;Witch;Lasso;Burger;Lotto Ticket;Worm;Fire;Grass;Parrot;Fear;" +
        "Nail;Giraffe;Painting;Train;Star;Cricket;Wave;Bench;Comedy;Monster;Baby;Wrench;Piano;Laptop;" +
        "Singer;Wasp;Roach;Dog;Sand;Swamp;Face;Lute;Flute;PC;Villa;Bee;Gun;Cat;Night;Fire;Iron;Sugar;Tears;" +
        "Mobile Phone;Tree;Snake;Stone;Hero;Laser Gun;Ladybug;Spike";
    console.log("Topics Set Completed");
    this.unityContent.send(
        "MockStats",
        "ReactSetTopicArray",
        topicString //Todo This are just dummy values, these values need to come from Backend Gameobject
    )
  }

  sendTopicList(){ //after having received the Topic List from the backend, send it as string to unity
    let topicListString = "10200";
    this.unityContent.send(
        "Rounds",
        "ReactSetTopicArray",
    )
  }

  //React will send the chosen topic for this round back to unity
  sendRoundsTopic(){
    console.log("sending back the topic to unity");
    let topic = "Database";
    this.unityContent.send(
        "MockStats",
        "ReactSetThisRoundsTopic",
        topic //Todo This are just dummy values, these values need to come from Backend Gameobject
    )
  }



  currentGame(){
    try{
      const response = api.get('/game?token=' + localStorage.getItem('gameToken'));

      this.setState({
        //fetch current game to unity by requesting for the states


      })
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }


  voteTopic(){
    try{
      //topic int 0 by default
      const response = api.put('/game/vote?=gameToken=' + this.state.gameToken + '&topic=' + this.state.topic);

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }


  //Input: Int which represent the current round
  //may range from 0 to 12, where 0 = Round 1 and 12 = Round 13
  setRound(){
    console.log("React has send the current Round to unity");
    let round = 0;
    this.unityContent.send(
        "MockStats",
        "ReactSetRound",
        round //Todo This are just dummy values, these values need to come from Backend Gameobject
    )
  }

  componentDidMount() {
/*    this.timerID = setInterval(
        () => this.currentGame(),
        1000
    );*/
  }

  componentWillUnmount() {
/*    clearInterval(this.timerID);*/
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


export default withRouter(UnityDummy);
