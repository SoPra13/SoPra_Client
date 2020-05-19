import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Spinner} from "../../views/design/Spinner";
import Room from "../../views/Room";
import ProfileInfo from "../../views/ProfileInfo";
import Gamedescription from "../../views/Gamedescription";
import Header2 from "../../views/Header2";
import Logo from "./Logo.png";

import Leaderboard from "../leaderboard/Leaderboard";

const Container = styled(BaseContainer)`
  height: 420px;
  color: white;
  text-align: center;
  overflow: hidden;
`;

const Container2 = styled(BaseContainer)`
  height: 460px;
  color: white;
  text-align: center;
  display: flex;
`;

const Container3 = styled.div`
  width: 500px;
  height: 420px;
  color: white;
  text-align: center;
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  height: 110px;
  background: ${props => props.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MiniContainer =styled.div`
    display: flex;
    justify-content: center;
    
`;

const TabText = styled.div`
 color: #FFC100;
 text-shadow: -1px 0 blue, 0 1px blue, 1px 0 blue, 0 -1px blue;
`;

const TabContentTitle = styled.div`
 color: #FFC100;
 text-shadow: -1px 0 blue, 0 1px red, 1px 0 red, 0 -1px red;
`;


const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LobbyContainer = styled.li`
  &:hover {
    transform: translateY(-2px);
    cursor: pointer;
  }
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


    editProfile(){
        this.props.history.push({
            pathname: '/dashboard/profile/editProfile',
            userToken: localStorage.getItem('userToken'),
        })
    }

    async enterPublicLobby(id, lobbyToken){
        localStorage.setItem('lobbyToken', lobbyToken);

        const response = await api.put('/lobby?joinToken='+ this.state.joinToken +
            `&userToken=` + localStorage.getItem('userToken'));

        // Get the returned user and update a new object.
        console.log(response.data);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store the token into the local storage.
        localStorage.setItem('lobbyToken', response.data.lobbyToken);

        this.props.history.push({
            pathname: '/dashboard/waitingLobby',
            id: id
        })
    }


    async enterPrivateLobby(id){
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
            console.log(response);
        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    /*
    0-99: bronze, 100-199: silver, 200-299: gold, 300-399: diamond, 400<= grandmaster
     */

    async logout() {

        const key = localStorage.getItem(('userToken'));
        try {
            await api.put('/logout?token=' + key);
        } catch (error) {
            alert(`Something went wrong while logging out: \n${handleError(error)}`);
        }
        localStorage.removeItem('userToken');
    }

    async loggedOut(){
        if(localStorage.getItem('userToken') === null){
            this.props.history.push('/login');
        }
    }



    async componentWillMount(){
        try {

            const key = localStorage.getItem('userToken');


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

        this.timerID3 = setInterval(
            () => this.loggedOut(),
            500
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID1);
        clearInterval(this.timerID2);
        clearInterval(this.timerID3);
    }


    render() {



        const localToken = localStorage.getItem("userToken");

        const tabComp =(
            <Tabs defaultIndex={0} onSelect={index => console.log(index)}>
                <TabList>
                    <Tab style={{background: "rgba(120, 26, 89, 0)"}}><TabText>Users & Leaderboard</TabText></Tab>
                    <Tab style={{background: "rgba(120, 26, 89, 0)"}}><TabText>Lobbies</TabText></Tab>
                    <Tab style={{background: "rgba(120, 26, 89, 0)"}}><TabText>Game Description and Rules</TabText></Tab>
                </TabList>



                <TabPanel>
<MiniContainer>
                    <Container3>
                        <h2><TabContentTitle>Registered User!</TabContentTitle></h2>
                        {!this.state.users ? (
                            <Spinner />
                        ) : (
                            <div>
                                <Users>
                                    {this.state.users.map(user => {
                                        return (
                                            <PlayerContainer>
                                                <ProfileInfo user={user}/>
                                            </PlayerContainer>
                                        );
                                    })}
                                </Users>
                            </div>
                        )}

                    </Container3>
    <Leaderboard/>
    </MiniContainer>
                </TabPanel>



                <TabPanel>
                    <Container2>
                        <Container>
                            <h2><TabContentTitle>Lobbies</TabContentTitle></h2>
                            {!this.state.lobbies ? (
                                <Spinner />
                            ) : (
                                <div>
                                    <Users>
                                        {this.state.lobbies.map(lobby => {
                                            return (
                                                <LobbyContainer
                                                    key={lobby.id}
                                                    onClick={() => {
                                                        this.state.joinToken=lobby.joinToken;
                                                        {lobby.lobbyType ==="PUBLIC" ? this.enterPublicLobby(lobby.id, lobby.lobbyToken) :
                                                            this.enterPrivateLobby(lobby.id)}
                                                    }}>
                                                    <Room lobby={lobby}/>
                                                </LobbyContainer>
                                            );
                                        })}
                                    </Users>
                                </div>
                            )}
                        </Container>
                    </Container2>


                </TabPanel>

                <TabPanel>

                    <Gamedescription/>
                </TabPanel>
            </Tabs>
        );

        return (
            <div>
        <HeaderContainer>
            <ButtonContainer>
                <Button
                    width="100px"
                    onClick={() => {
                    this.logout()
                }}
                >
                    Logout
                </Button>
                <br/>
                <Button maring-top="10px"
                    width="100px"
                    onClick={() => {
                        this.editProfile()
                    }}
                >
                    Edit
                </Button>
            </ButtonContainer>


                <img src={Logo} width="90px"/>
            <ButtonContainer>
                <Button
                    width="100px"
                    onClick={() => {
                        this.props.history.push('/dashboard/customLobby');
                    }}
                >
                    Create Lobby
                </Button>
                <br/>
                <Button
                    width="100px"
                    height="48px"
                    onClick={() => {
                        this.props.history.push('/dashboard/loginLobby');
                    }}
                >
                    Enter private Lobby
                </Button>
            </ButtonContainer>
        </HeaderContainer>

                <div className="background2">
                    {tabComp}
                </div>
            </div>

        );
    }


}
export default withRouter(Dashboard);
