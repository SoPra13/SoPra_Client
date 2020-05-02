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
import Room from "../../views/Room";
import EditProfile from "../profile/EditProfile";
import ProfileInfo from "../../views/ProfileInfo";
import Gamedescription from "../../views/Gamedescription";

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
  overflow: auto;
  height: 310px;
`;

const User1 = styled.ul`
  list-style: none;
  padding-left: 0;
`;


const Lobbies = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const central = styled.div`
  text-align: center;
`;

const centralFlexbox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const LoginForm = styled.div`
  width: 40%;
  height: 300px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background-color: #ffca65;
  text-align: center;
`;

const titleh2 = styled.h2`
text-align: center;
`;

const List1 = styled.ul`
  list-style-type: none;
  text-align: center;
  margin-bottom: 40px;
  `;

const UsersContainer = styled.div`
  margin-top: 50px;
  height: 150px;
  overflow: auto;
`;

const LobbiesContainer = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  height: 150px;
  overflow: auto;
`;

const PlayerButton = styled.li`
width: 300px;
color: #fff;
background-color: #0e3d61;
border: 2px solid;
border-color: #c5c5c5;
border-radius: 20px;
height: 50px;
line-height: 38px;
padding: 5px 20px;
margin-bottom: 10px;
text-align: center;
box-sizing: border-box;
`;

const LobbyButton = styled.li`
color: #5a5a5a;
background-color: #ffa700;
border: 2px solid;
border-color: #5a5a5a;
border-radius: 5px;
height: 50px;
line-height: 38px;
padding: 5px 20px;
margin-bottom: 10px;
text-align: center;
box-sizing: border-box;
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

    constructor() {
        super();
        this.state = {
            users: null,
            user: null,
            userId: null,
            lobbies: null,
            lobbyname: null,
            tabIndex: 0
        };
    }

    async logout() {
        const key = localStorage.getItem(('userToken'))

        console.log(key);

        try {
            const response = await api.put('/logout?token=' + key);

            console.log(response);
        } catch (error) {
            alert(`Something went wrong while logging out: \n${handleError(error)}`);
        }
        localStorage.removeItem('userToken');
        this.props.history.push('/login');

    }

    showProfile(id){
        this.props.history.push({
            pathname: `/dashboard/profile`,
            userId: id
        })
    }


    editProfile(id){
        this.props.history.push({
            pathname: '/dashboard/profile/editProfile',
            id: id,
        })
    }

    enterLoginLobby(id){
        this.props.history.push({
            pathname: '/dashboard/loginLobby',
            id: id
        })
    }

/*    async deleteLobby(){
        const response = await api.get('/lobbies');
        if (response.data.playerList.length == 0){
            const token = response.data.lobbyToken;
            await api.delete('/lobby?lobbyToken=' + token);
        }
    }*/


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

    async componentWillMount(){
        try {

            const key = localStorage.getItem('userToken')


            const respo = await api.get('/user/?token=' + key);
            this.setState({user: respo.data});
            console.log(respo);

            const response = await api.get('/users');
            this.setState({ users: response.data });
            console.log(response);


            const resp = await api.get('/lobbies');
            this.setState({ lobbies: resp.data });
            console.log(resp);

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }

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

            console.log(response);
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }

/*        this.timerID = setInterval(
            () => this.deleteLobby(),
            1000
        );*/
    }

    componentWillUnmount() {
/*        clearInterval(this.timerID);*/
    }


    render() {

        const localToken = localStorage.getItem("userToken");

        const tabComp =(
            <Tabs defaultIndex={0} onSelect={index => console.log(index)}>
                <TabList>
                    <Tab>My Profile</Tab>
                    <Tab>Users</Tab>
                    <Tab>Lobby</Tab>
                    <Tab>Game description and rules</Tab>
                </TabList>

                <TabPanel>

                    <Button
                        position = "absolute"
                        top = "0"
                        right = "0"
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </Button>


                    <Container>
                        <h2>Profile</h2>
                        {!this.state.user ? (
                            <Spinner />
                        ) : (
                            <div>
                                <User1>
                                    <PlayerContainer key={this.state.user.id}>
                                        <ProfileInfo user={this.state.user}/>
                                    </PlayerContainer>
                                </User1>

                                {(this.state.user.token != localToken) ? (
                                    <Label> </Label>
                                ) : (
                                    <ButtonContainer>
                                        <Button
                                            width="30%"
                                            onClick={() => {
                                                this.editProfile(this.state.user.id)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </ButtonContainer>
                                )}
                            </div>
                        )}
                    </Container>



                </TabPanel>

                <TabPanel>

                    <Button
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </Button>

                    <Container>
                        <h2>Registered User! </h2>
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

                    <Button
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </Button>

                    <Container>
                        <h2>All lobbies</h2>
                        {!this.state.lobbies ? (
                            <Spinner />
                        ) : (
                            <div>
                                <Users>
                                    {this.state.lobbies.map(lobby => {
                                        return (
                                            <PlayerContainer
                                                key={lobby.id}
                                                onClick={() => {
                                                    console.log(lobby.id)
                                                    this.enterLoginLobby(lobby.id);
                                                }}>
                                                <Room lobby={lobby}/>
                                            </PlayerContainer>
                                        );
                                    })}
                                </Users>
                            </div>
                        )}
                    </Container>


                    <Button
                        position = "absolute"
                        onClick={() => {
                            this.props.history.push('/dashboard/customLobby');
                        }}
                    >
                        Create Lobby
                    </Button>


                </TabPanel>

                <TabPanel>

                    <Button
                        position = "absolute"
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </Button>
                    <Gamedescription/>
                </TabPanel>
            </Tabs>
        );

        return (
            <div>
                {tabComp}
            </div>

        );
    }
}

export default withRouter(Dashboard);
