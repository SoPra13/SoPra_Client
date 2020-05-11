import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Lobby from "../shared/models/Lobby";
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import Header from "../../views/Header";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;


const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: rgba(150, 0, 255, 0.5);
  transition: opacity 0.5s ease, transform 0.5s ease;
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
  background: rgba(255, 255, 255, 0.3);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


/**
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class CustomLobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lobbyname: null,
            adminToken: localStorage.getItem('userToken'),
            lobbyType: "PUBLIC"
        };
    }

    async create() {
        try {
            const requestBody = JSON.stringify({
                lobbyname: this.state.lobbyname,
                adminToken: this.state.adminToken,
                lobbyType: this.state.lobbyType
            });
            const response = await api.post('/lobby', requestBody);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Get the returned user and update a new object.
            const lobby = new Lobby(response.data);

            localStorage.setItem('lobbyToken', lobby.lobbyToken);
            console.log(lobby);
            console.log(lobby.lobbyToken);



            this.props.history.push(`/dashboard/waitingLobby`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    }

    changeLobbyType(){
        if(this.state.lobbyType==="PUBLIC"){
            this.setState({
                lobbyType: "PRIVATE"
            })}else{
            this.setState({
                lobbyType: "PUBLIC"
            })
        }
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }


    componentDidMount() {}

    render() {
        return (
            <div>        <Header height={"80"} />
                <BaseContainer>
                    <FormContainer>
                        <Form>
                            <Label>Lobby name</Label>
                            <InputField
                                placeholder="Enter here.."
                                onChange={e => {
                                    this.handleInputChange('lobbyname', e.target.value);
                                }}
                            />


                            <ButtonContainer>
                                <Button
                                    onClick={() => {
                                        this.changeLobbyType();
                                    }}
                                >
                                    {this.state.lobbyType === "PUBLIC" ? "Set as Public" : "Set as Private"}
                                </Button>

                            </ButtonContainer>

                            <ButtonContainer>
                                <Button
                                    width="30%"
                                    onClick={() => {
                                        this.create();
                                    }}
                                >
                                    Create
                                </Button>
                            </ButtonContainer>

                            <ButtonContainer>
                                <Button
                                    width="30%"
                                    onClick={() => {
                                        this.props.history.push('/dashboard');
                                    }}
                                >
                                    Back
                                </Button>
                            </ButtonContainer>
                        </Form>
                    </FormContainer>
                </BaseContainer>
            </div>
        );
    }
}


export default withRouter(CustomLobby);
