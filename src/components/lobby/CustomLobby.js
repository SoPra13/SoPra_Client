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

const active = styled.div`
.active, .btn:hover {
  background-color: #666;
  color: white;
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

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class CustomLobby extends React.Component {

    constructor() {
        super();
        this.state = {
            lobbyname: null,
            password: null,
            lobbyType: null
        };
    }
    /**
     * getUserID()
     * addBot()
     * invitePlayer()
     * ready() => if all players, but the bots,  are ready, it starts automatically the game
     */
    async create() {
        try {
            const requestBody = JSON.stringify({
                lobbyname: this.state.lobbyname,
                password: this.state.password,
                adminToken: this.state.adminToken,
                lobbyType: this.state.lobbyType
            });
            const response = await api.post('/lobby', requestBody);

            // Get the returned user and update a new object.
            const lobby = new Lobby(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', lobby.lobbyToken);


            this.props.history.push(`/dashboard`);
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
        this.state.lobbyState = "PUBLIC";
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
                        <Label>Password</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                        />

                        <ButtonContainer>
                            <active>
                            <Button
                                width="30%"
                                onClick={() => {
                                    this.setState({
                                        lobbyType: "PUBLIC"
                                });
                                }}
                            >
                                Create
                            </Button>
                            </active>

                            <Button
                                width="30%"
                                onClick={() => {
                                    this.setState({
                                        lobbyType: "PRIVATE"
                                });
                                }}
                            >
                                Create
                            </Button>
                        </ButtonContainer>

                        <ButtonContainer>
                            <Button
                                disabled={!this.state.lobbyname}
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

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(CustomLobby);
