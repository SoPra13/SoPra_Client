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

        //This listener is called on every frame by unity and needs to receive Backend Information
        this.unityContent.on("GameStarted", started =>{
            //Todo Create "Total Player" integer from Backend, update the this.state.totalPlayers and then update unity via setPlayers()
            //Todo Create "players Joined" integer from the Backend, update the this.state.playersJoined and then update Unity via addPlayers()

            this.setPlayers();
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
                <Unity unityContent={this.unityContent} />
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
