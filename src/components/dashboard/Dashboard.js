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
import Header2 from "../../views/Header2";

import Avenger from '../../image/avatar/Avenger.png';
import Lion from '../../image/avatar/Lion.png';
import Magneto from '../../image/avatar/Magneto.png';
import Meow from '../../image/avatar/Meow.png';
import MsWednesday from '../../image/avatar/MsWednesday.png';
import Robot from '../../image/avatar/Robot.png';
import Urgot from '../../image/avatar/Urgot.png';

import Bronze from '../../image/rank/Bronze.png'
import Silver from '../../image/rank/Silver.png'
import Gold from '../../image/rank/Gold.png'
import Diamond from '../../image/rank/Diamond.png'
import GrandMaster from '../../image/rank/GrandMaster.png'

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

const MiniContainer =styled.div`
    display: flex;
    justify-content: right;
`;

const TabText = styled.div`
 color: #FFC100;
 text-shadow: -1px 0 blue, 0 1px blue, 1px 0 blue, 0 -1px blue;
`;

const TabContentTitle = styled.div`
 color: #FFC100;
 text-shadow: -1px 0 blue, 0 1px red, 1px 0 red, 0 -1px red;
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

    enterPublicLobby(id, lobbyToken){
        localStorage.setItem('lobbyToken', lobbyToken);
        this.props.history.push({
            pathname: '/dashboard/waitingLobby',
            id: id
        })
    }


    enterPrivateLobby(id){
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

    /*
    0-99: bronze, 100-199: silver, 200-299: gold, 300-399: diamond, 400<= grandmaster
     */


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

    async loggedOut(){
        if(localStorage.getItem('userToken') === null){
            this.props.history.push('/login');
        }
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
                    <Tab><TabText>My Profile</TabText></Tab>
                    <Tab><TabText>Users</TabText></Tab>
                    <Tab><TabText>Lobbies</TabText></Tab>
                    <Tab><TabText>Game Description and Rules</TabText></Tab>
                </TabList>

                <TabPanel>
                    <Container>
                        <h2><TabContentTitle>My Profile</TabContentTitle></h2>
                        {!this.state.user ? (
                            <Spinner />
                        ) : (
                            <div>
                                <User1>
                                    <PlayerContainer key={this.state.user.id}>
                                        <ProfileInfo user={this.state.user}/>
                                    </PlayerContainer>
                                </User1>

                                {(this.state.user.token !== localToken) ? (
                                    <Label> </Label>
                                ) : (
                                    <ButtonContainer>
                                        <Button
                                            width="10%"
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

                    <Container>
                        <h2><TabContentTitle>Registered User!</TabContentTitle></h2>
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
                                                    console.log(user.id);
                                                    this.showProfile(user.id);
                                                }}>
                                                <ProfileInfo user={user}/>
                                            </PlayerContainer>
                                        );
                                    })}
                                </Users>
                            </div>
                        )}
                    </Container>

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
                                                <PlayerContainer
                                                    key={lobby.id}
                                                    onClick={() => {
                                                        {lobby.lobbyType ==="PUBLIC" ? this.enterPublicLobby(lobby.id, lobby.lobbyToken) :
                                                            this.enterPrivateLobby(lobby.id)}
                                                    }}>
                                                    <Room lobby={lobby}/>
                                                </PlayerContainer>
                                            );
                                        })}
                                    </Users>
                                </div>
                            )}
                        </Container>

                        <MiniContainer>

                            <Button
                                position = "absolute"
                                onClick={() => {
                                    this.props.history.push('/dashboard/customLobby');
                                }}
                            >
                                Create Lobby
                            </Button>
                        </MiniContainer>

                    </Container2>


                </TabPanel>

                <TabPanel>

                    <Gamedescription/>
                </TabPanel>
            </Tabs>
        );

        return (
            <div>
                <Header2 height={"80"} >
                </Header2>
                <div className="background2">
                    {tabComp}
                </div>
            </div>

        );
    }


}
export default withRouter(Dashboard);
