import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Lobby from "../shared/models/Lobby";
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Active = styled.div`
.active, .btn:hover {
  background-color: #666;
  color: #c92222;
 `;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
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
  background: rgba(255, 255, 255, 0.2);
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

function ready(){
    const requestBody = JSON.stringify({
        lobbyname: this.state.lobbyname,
        userToken: this.state.userToken,
        lobbyType: this.state.lobbyType
    });
    const response = api.post(`/lobby/ready` + `?userToken={userToken}` + localStorage.getItem(`userToken`)
    + `&gameToken={gameToken}` + localStorage.getItem(`gameToken`), requestBody)
}

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

            // Get the returned user and update a new object.
            const lobby = new Lobby(response.data);

            console.log(lobby);
            console.log(lobby.lobbyToken);

            // Store the token into the local storage.
            localStorage.setItem('lobbyToken', lobby.lobbyToken);


            this.props.history.push(`/dashboard/waitingLobby`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
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


    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {
    }

    render() {
        return (
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
{/*                        <Label>Password</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                        />*/}

                        <ButtonContainer>
                            <Active>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        lobbyType: "PUBLIC"
                                });
                                }}
                            >
                                Public
                            </Button>
                            </Active>
{/*                            <Button
                                onClick={() => {
                                    this.setState({
                                        lobbyType: "PRIVATE"
                                });
                                }}
                            >
                                Private
                            </Button>*/}
                        </ButtonContainer>

                        <ButtonContainer>
                            <Button
                                disabled={/*this.state.lobbyType == null || (this.state.lobbyType === "PRIVATE" && this.state.password == null)
                                || */this.state.lobbyname == null}
                                width="30%"
                                onClick={() => {
                                    this.create();
                                }}
                            >
                                Create
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}


export default withRouter(CustomLobby);
