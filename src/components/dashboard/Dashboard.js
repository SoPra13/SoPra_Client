import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Spinner} from "../../views/design/Spinner";
import Player from "../../views/Player";
import Room from "../../views/Room";
import ProfileInfo from "../../views/ProfileInfo";
import Gamedescription from "../../views/Gamedescription";
import Header from "../../views/Header";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
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

    async getUsers(){
        try{
            const response = await api.get('/users');
            this.setState({ users: response.data });
        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }

    }

    async getLobbies(){
        try{
            const response = await api.get('/lobbies');
            this.setState({ lobbies: response.data });
        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }

    }


    async componentWillMount(){
        try {

            const key = localStorage.getItem('userToken')


            const respo = await api.get('/user/?token=' + key);
            this.setState({user: respo.data});
            console.log(respo);

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
        this.getLobbies();
        console.log(this.state.lobbies);

        this.getUsers();
        console.log(this.state.users);

    }

    async componentDidMount() {

       this.timerID1 = setInterval(
            () => this.getUsers(),
            1000
        );
          this.timerID2 = setInterval(
                    () => this.getLobbies(),
                    1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID1);
        clearInterval(this.timerID2);
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
                <Header height={"80"} />
                {tabComp}
            </div>

        );
    }
}

export default withRouter(Dashboard);
