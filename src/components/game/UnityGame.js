//Unity Component in here
import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import Unity, { UnityContent } from "react-unity-webgl";

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

export class UnityGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            username: null,
            started: false,
            totalPlayers: 3, //has to be fetched from the backend, 3 is the default value
            playersJoined: 0 //used to communicate with unity
        };

        //unityContent is our unity code accessor
        this.unityContent = new UnityContent(
            "unity_project_build/Build.json",
            "unity_project_build/UnityLoader.js"
        );

        this.unityContent.on("ComTest", score =>{
            console.log("Es funzt!" + score);
        });

        this.unityContent.on("PlayerHasConnected", () =>{
            console.log("PlayerHasConnected");
            this.setPlayerStats();
        });

        this.unityContent.on("AskForTopicsList", () =>{
            console.log("Unity asked for the TopicList");
            this.sendTopicList();
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
    }

    setPlayers(){
        this.unityContent.send(
            "PlayerTotal",
            "SetPlayerTotal",
            this.state.totalPlayers
        )
    }

    addPlayer(){
        this.unityContent.send(
            "PlayerTotal",
            "SetPlayerCount",
            4
        )
    }

    setPlayerStats(){ //activePlayer;playerTotal;playerPosition;connectPlayers
        let infoString = "1423";
        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerStats",
            infoString //Todo This are just dummy values, these values need to come from Backend Gameobject
        )
    }

    setPlayerNames(){ //Send a string with a ";" delimiter to unity
        let nameString = "Baba;Ganoush;Trimotop;Slayer99;Ivan;Boehlen;SonGoku";
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
            topicListString //Todo This are just dummy values, these values need to come from Backend Gameobject
        )
    }

    async somethingFun() {

    }

    componentDidMount() {}

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

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(UnityGame);
