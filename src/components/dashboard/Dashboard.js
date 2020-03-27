import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Lobby from "../shared/models/Lobby";
import { Spinner} from "../../views/design/Spinner";
import Player from "../../views/Player";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

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

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LobbyContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Lobbies = styled.ul`
  list-style: none;
  padding-left: 0;
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
class Dashboard extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            users: null,
            id: null,
            lobbies: null
        };
    }

    async logout() {
        try {
            const response = await api.put("/logout/" + localStorage.getItem("token"));

        } catch (error) {
            alert(`Something went wrong while logging out: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    showProfile(id){
        this.props.history.push({
            pathname: '/users/{userID}',
            id: id
        })
    }

    enterLobby(id) {
        if (this.password == null) {
            this.props.history.push({
                pathname: '/lobby/{lobbyID}',
                id: id
            })
        }
        else{
            try {
                const requestBody = JSON.stringify({
                    lobbyname: this.state.lobbyname,
                    password: this.state.password
                });
                const response = api.post('/users', requestBody);

                // Get the returned user and update a new object.
                const user = new User(response.data);

                // Store the token into the local storage.
                localStorage.setItem('token', user.token);

                // Login successfully worked --> navigate to the route /game in the GameRouter
                this.props.history.push(`/lobby/{lobbyID}`);
            } catch (error) {
                alert(`Something went wrong during the login: \n${handleError(error)}`);
            }
        }
    }

    async createLobby(){
        try {
            const requestBody = JSON.stringify({
                lobbyname: this.state.lobbyname,
                password: this.state.password
            });
            const response = await api.post('/lobbies', requestBody);

        } catch (error) {
            alert(`Something went wrong during the registration: \n${handleError(error)}`);
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

    async componentDidMount() {
        try {
            const response = await api.get('/users');
            // delays continuous execution of an async operation for 1 second.
            // This is just a fake async call, so that the spinner can be displayed
            // feel free to remove it :)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            this.setState({ users: response.data });

            const resp = await api.get('/lobbies');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            this.setState({ lobbies: resp.data });

            // See here to get more data.
            console.log(response);
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {}

    render() {
        return (


            <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                <TabList>
                    <Tab>My Profile</Tab>
                    <Tab>Users</Tab>
                    <Tab>Lobby</Tab>
                    <Tab>Invitations</Tab>

                    <Button
                        width="100%"
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </Button>

                </TabList>
                <TabPanel>
                    <Container>
                    <h2> My profile details </h2>
                    {!this.state.users ? (
                        <Spinner />
                    ) : (
                        <div>
                            <Users>
                                {this.state.users.map(user => {
                                    return (
                                        <PlayerContainer
                                            key={user.id}
                                            onClick={() => {
                                                console.log(user.id)
                                                this.showProfile(user.id);
                                            }}>
                                            <Player user={user}/>
                                        </PlayerContainer>
                                    );
                                })}
                            </Users>
                        </div>
                    )}
                </Container>
                </TabPanel>
                <TabPanel>
                    <Container>
                        <h2>Registered Users </h2>
                        {!this.state.users ? (
                            <Spinner />
                        ) : (
                            <div>
                                <Users>
                                    {this.state.users.map(user => {
                                        return (
                                            <PlayerContainer
                                                key={user.id}
                                                onClick={() => {
                                                    console.log(user.id)
                                                    this.showProfile(user.id);
                                                }}>
                                                <Player user={user}/>
                                            </PlayerContainer>
                                        );
                                    })}
                                </Users>
                            </div>
                        )}
                    </Container>
                </TabPanel>
                <TabPanel>                    <Container>
                    <h2>All active lobbies </h2>
                    {!this.state.lobbies ? (
                        <Spinner />
                    ) : (
                        <div>
                            <Lobbies>
                                {this.state.lobbies.map(lobby => {
                                    return (
                                        <PlayerContainer
                                            key={lobby.id}
                                            onClick={() => {
                                                console.log(lobby.id)
                                                this.enterLobby(lobby.id);
                                            }}>
                                            <Player lobby={lobby}/>
                                        </PlayerContainer>
                                    );
                                })}
                            </Lobbies>
                        </div>
                    )}

                    <ButtonContainer>
                        <Button
                            width="30%"
                            onClick={() => {this.createLobby();}}
                        >
                            Back
                        </Button>
                    </ButtonContainer>
                </Container>
                </TabPanel>
                <TabPanel>Panel 4</TabPanel>
            </Tabs>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Dashboard);
