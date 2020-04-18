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

class UnityGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lobbyToken: localStorage.getItem('lobbyToken'),
            userToken: localStorage.getItem('userToken'),
            gameToken: localStorage.getItem('gameToken'),
            name: null,
            username: null,
            topic: 0
        };

        //unityContent is our unity code accessor
        this.unityContent = new UnityContent(
            "unity_project_build/Build.json",
            "unity_project_build/UnityLoader.js"
        );
    }

    stringToArray(str){
        let array = [];
        for (let i = 0; i < str.length; i++){
            array.push(parseInt(str.charAt(i)));
        }
        return array;
    }

    isReady(){
        try
        {
        const requestBody = JSON.stringify({
            gameToken: localStorage.getItem('gameToken'),
            userToken: localStorage.getItem('userToken'),
            status: "READY"
        });
        const response = api.put('/game/ready?userToken=' + this.state.userToken +
            '&gameToken=' + this.state.gameToken);

    } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
}



    currentGame(){
        try{
        const response = api.get('/game/' + this.state.gameToken);

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
                                    //send to unity
                                }}
                            >
                                P1-Connect
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    //send to unity
                                }}
                            >
                                P2-Connect
                            </Button>
                            <Button
                                width="15%"
                                onClick={() => {
                                    //send to unity
                                }}
                            >
                                P3-Connect
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


export default withRouter(UnityGame);
