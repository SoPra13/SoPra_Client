import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { withRouter } from 'react-router-dom';
import BotPlayer from "../../views/BotPlayer";
import Chat from '../chat/Chat';
import ProfileInfo from "../../views/ProfileInfo";

const NonAdmin = styled.div`
  display: none;
`;

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Chatbox = styled.ul`
  list-style: none;
  padding-left: 40px;
`;

const EmptyBox = styled.div`
    width: 280px;
`;

const EmptyBox2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 300px;
`;

const EmptyBox3 = styled.div`
    width: 290px;
`;

const EmptyBox4 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 350px;
`;

const MultipleListsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TabContentTitle = styled.div`
 color: #FFC100;
 text-shadow: -1px 0 blue, 0 1px red, 1px 0 red, 0 -1px red;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const KickContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Button1 = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  margin-top: 30px;
  margin-bottom: 30px;
   margin-left: 10px;
  padding: 6px;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  color: rgba(248, 248, 148);
  width: ${props => props.width || null};
  height: ${props => props.height || null};
  border: 2px solid;
  border-color: rgba(248, 248, 148);
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgba(120, 26, 89, 0.8);
  transition: all 0.3s ease;
`;

class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerList: null,
            botList: null,
            lobbyToken: localStorage.getItem('lobbyToken'),
            difficulty: "FRIEND",
            numberOfPlayers: 7,
            numberOfBots: 0,
            lobbyType: null,
            adminToken: null,
            joinToken: null,
            isToggleReady: false,
            lobbyname: null,
            lobbyInGame:null
        };
    }

    /**
     * add a bot with his difficulty
     * @param str (is his difficulty to add a bot with a certain behaviour to the lobby.botList)
     */

    addBot(str){
        api.put('/lobby?lobbyToken=' + this.state.lobbyToken + '&difficulty=' + str);
    }

    /**
     * bot will be removed from the lobby.botList
     * @param botToken (bot with unique token)
     */

    async removeBot(botToken){
        await api.delete('/lobby?lobbyToken=' + this.state.lobbyToken + '&botToken=' + botToken);
    }

    /**
     * the user with the userToken xy will be removed from the lobby.playerList
     * @param userToken (stored in the lobby)
     */

    async kickPlayer(userToken){
        try {
            await api.delete('/lobby?lobbyToken=' + localStorage.getItem('lobbyToken')
                + '&userToken=' + userToken);

            //console.log('Player get kicked from the admin');

            this.props.history.push('/dashboard');

        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    /**
     * if a player gets kicked, his local lobbyToken will be removed and redirected to /dashboard
     */

    getKicked(){

        //console.log('My lobby token is before: ' + localStorage.getItem('lobbyToken'));

        localStorage.removeItem('lobbyToken');

        //console.log('My lobby token is deleted: ' + localStorage.getItem('lobbyToken'));

        this.props.history.push('/dashboard');
    }

    /**
     * function to check whether the user part of the lobby is or not
     * if not, the player will be redirected to redirected to /dashbaord
     * local lobbyToken will be removed
     */

    stillInTheLobby(){
        //console.log('My lobbytoken: ' + localStorage.getItem('lobbyToken'));
        if(this.checkPlayerList() == undefined){
            this.getKicked();
            this.props.history.push('/dashboard');
        }
        //console.log(this.checkPlayerList());
    }


    checkPlayerList(){
        for(let i=0; i<this.state.playerList.length; i++){
            if(this.state.playerList[i].token == localStorage.getItem('userToken')){
                return true;

            }
        }
    }

    /**
     * deletes the userToken from the lobby
     * removes the local lobbytoken
     * routes to the /dashboard
     */

    leaveLobby(){
        try {
            api.delete('/lobby?lobbyToken=' + localStorage.getItem('lobbyToken')
                + '&userToken=' + localStorage.getItem('userToken'));

            localStorage.removeItem('lobbyToken');
            this.props.history.push('/dashboard');


        }catch (error) {
            alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
        }
    }


    /**
     * function to update the playerList and botList
     */

    async getLobby(){
        try {
            const response = await api.get('/lobby?lobbyToken='+ localStorage.getItem('lobbyToken'));
            //console.log(response.data);
            await api.put('/user/updateingametab?userToken=' + localStorage.getItem('userToken'));
            // Get the returned users and update the state.
            this.setState({
                playerList: response.data.playerList,
                botList: response.data.botList,
                adminToken: response.data.adminToken,
                joinToken: response.data.joinToken,
                lobbyname: response.data.lobbyName,
                lobbyType: response.data.lobbyType
            });

            // See here to get more data.
            //console.log(response.data.playerList);
        } catch (error) {
            alert(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
            this.props.history.push('/dashboard');
        }
    }

    async checkForGame(){
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await api.get('/game?token=' + localStorage.getItem('lobbyToken'));



            this.setState({
                game: true,
            });

            //console.log(this.state.game);

        } catch (error) {
            this.setState({
                game: false,
            });
        }
    }

    /**
     * updates the user status as READY
     */

    ready(){
        try {
            const requestBody = JSON.stringify({
                lobbyToken: localStorage.getItem('lobbyToken'),
                userToken: localStorage.getItem('userToken'),
                status: "READY"
            });
            api.put('/lobby/ready?userToken=' + localStorage.getItem('userToken')
                + '?gameToken=' + localStorage.getItem('userToken'), requestBody);


        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }



    /**
     * updates the game object
     * note: lobbyToken = gameToken
     * routes to /unityGame
     */

    enterGame(){
        try {
            const response = api.put('/lobby/' + localStorage.getItem('lobbyToken')
                + '/game');

            //console.log(response);
            //console.log(response.data);
            localStorage.setItem('gameToken', localStorage.getItem('lobbyToken'));
            //console.log(localStorage.getItem('gameToken'));

            this.props.history.push('/unityGame');

        }catch (error) {
            alert(`Enter game: \n${handleError(error)}`);
        }
    }

    /**
     * componentWillMount() sets the states of playerList and botList before the first rendering
     */

    async componentWillMount() {
        const response = await api.get('/lobby?lobbyToken=' + localStorage.getItem('lobbyToken'));


        const lobby = response.data;
        //console.log(lobby);

        if(lobby.lobbyState ==='INGAME'){
            //console.log("INGAME");
            this.setState({
                lobbyInGame: true
            })
        }else{
            //console.log("OUTGAMe");
            this.setState({
                lobbyInGame: false
            })
        }
        this.setState({
            playerList: lobby.playerList,
            botList: lobby.botList,
            lobbyname: lobby.lobbyName
        });
        //console.log(lobby);
    }


    /**
     * componentDidMount() mounts the lobby to change the state of playerList every 1s and botList every 2s
     * componentWillUnmount resets the timer
     */
    async handleEvent(event){
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = '';

        const key = localStorage.getItem(('userToken'));

        await api.put('/logout?token=' + key);

        localStorage.clear();
    }

    componentDidMount() {
        this.timerID1 = setInterval(
            () => this.getLobby(),
            1000
        );
        this.timerID2 = setInterval(
            () => this.stillInTheLobby(),
            2000,

        );
        window.addEventListener('beforeunload', this.handleEvent);
    }

    componentWillUnmount() {
        clearInterval(this.timerID1);
        clearInterval(this.timerID2);
        window.removeEventListener('beforeunload', this.handleEvent);

    }

    render() {



        return (
            <div>
                <BaseContainer>
                    <Container>

                        <h2><TabContentTitle>Players & Bots of Lobby {this.state.lobbyname}</TabContentTitle></h2>
                        <h2> <TabContentTitle>{this.state.lobbyType === "PUBLIC" ? "" : "Password as private lobby: " + this.state.joinToken}</TabContentTitle></h2>
                        <div>
                            <MultipleListsContainer style={{justifyContent: "space-between"}}>

                            {this.state.botList === null || this.state.botList.length === 0 ? (
                                localStorage.getItem('userToken') === this.state.adminToken ? (<EmptyBox4/>):(<EmptyBox2/>)
                            ) : (
                                <div>
                                    <MultipleListsContainer style={{paddingRight: "0px"}}>
                                        <Users>
                                            {this.state.botList.map(bot => {
                                                return (
                                                    <PlayerContainer
                                                        key={bot.id}
                                                        onClick={() => {
                                                            //console.log(bot.id)
                                                            /*nothing happens but a console log*/
                                                        }}>
                                                        <BotPlayer bot={bot}/>
                                                    </PlayerContainer>
                                                );
                                            })}
                                        </Users>
                                        {localStorage.getItem('userToken') !== this.state.adminToken ?
                                            (<NonAdmin/>)
                                            :(
                                                <Users>
                                                    {this.state.botList.map(bot => {
                                                        return (
                                                            <KickContainer>
                                                                <Button1
                                                                    height="35px"
                                                                    disabled = {localStorage.getItem('userToken') != this.state.adminToken}
                                                                    key={bot.id}
                                                                    onClick={() => {
                                                                        //console.log(bot.id);
                                                                        //console.log(bot.token);
                                                                        this.removeBot(bot.token)
                                                                    }}>
                                                                    Kick
                                                                </Button1>
                                                            </KickContainer>
                                                        );
                                                    })}
                                                </Users>
                                            )}
                                    </MultipleListsContainer>
                                </div>
                            )}


                            {!this.state.playerList ? (
                                <Spinner />
                            ) : (
                                <div>
                                    <MultipleListsContainer style={{paddingRight: "20px"}}>
                                        <Users>
                                            {this.state.playerList.map(user => {
                                                return (
                                                    <PlayerContainer
                                                        key={user.id}
                                                        onClick={() => {
                                                            //console.log(user.id)
                                                            /*nothing happens but a console log*/
                                                        }}>
                                                        <ProfileInfo user={user}/>
                                                    </PlayerContainer>
                                                );
                                            })}
                                        </Users>
                                        {localStorage.getItem('userToken') !== this.state.adminToken ?
                                            (<NonAdmin/>)
                                            :
                                            (
                                        <Users>
                                            {this.state.playerList.map(user => {
                                                return (
                                                    <KickContainer>
                                                        <Button1
                                                            height="35px"
                                                            disabled = {localStorage.getItem('userToken') !== this.state.adminToken}
                                                            key={user.id}
                                                            onClick={() => {
                                                                //console.log(user.id);
                                                                this.kickPlayer(user.token)
                                                            }}>
                                                            Kick
                                                        </Button1>
                                                    </KickContainer>
                                                );
                                            })}
                                        </Users>
                                            )}

                                    </MultipleListsContainer>
                                </div>
                            )}

                            <Chatbox>
                                <Chat/>
                            </Chatbox>

                            </MultipleListsContainer>





                    <MultipleListsContainer style={{justifyContent: "space-between"}}>

                        {localStorage.getItem('userToken') !== this.state.adminToken ?
                            (<EmptyBox3/>)
                            :
                            (<div>
                                    <MultipleListsContainer>

                                        <Button1
                                            style={{marginBottom: "0px", marginTop:"0px"}}
                                            disabled={this.state.botList.length>=4}
                                            width="38%"
                                            onClick={() => {
                                                this.addBot('FRIEND');
                                            }}
                                        >
                                            ADD FRIENDLY BOT
                                        </Button1>

                                        <Button1
                                            style={{marginBottom: "0px", marginTop:"0px"}}
                                            disabled={this.state.botList.length>=4}
                                            width="35%"
                                            onClick={() => {
                                                this.addBot('HOSTILE');
                                            }}
                                        >
                                            ADD HOSTILE BOT
                                        </Button1>
                                    </MultipleListsContainer>
                                </div>
                            )
                        }




                        <MultipleListsContainer>
                        <Button1
                            style={{marginBottom: "0px", marginTop:"0px"}}
                            disabled = {(this.state.adminToken == localStorage.getItem('userToken')&&this.state.playerList.length > 1)}
                            width="110px"
                            onClick={() => {
                                this.leaveLobby();

                            }}
                        >
                            Leave
                        </Button1>


                    <Button1
                        style={{marginBottom: "0px", marginTop:"0px"}}
                        disabled = { this.state.lobbyInGame || (this.state.playerList != null && this.state.playerList.length < 3)}
                        onClick={() => {
                            this.enterGame();
                        }}
                    >
                        Join into Game
                    </Button1>
                            </MultipleListsContainer>

                        <EmptyBox/>
                    </MultipleListsContainer>
                    </div>

                    </Container>
                </BaseContainer>
            </div>

        );
    }
}

export default withRouter(WaitingRoom);
