import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Lobby from "../shared/models/Lobby";

/*for all players place a ready button, by condition if all players are ready starts a game object automatically*/


const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
            numberOfBots: 0
        };
    }

    addBot(){
    const response = api.put('/lobby?lobbyToken=' + this.state.lobbyToken + '&difficulty=' + this.state.difficulty)
    }

    removeBot(botToken){
        const response = api.delete('/lobby?lobbyToken=' + this.state.lobbyToken + '&botToken=' + botToken)

    }

    leaveLobby(){
        try {
            const response = api.delete('/lobby?lobbyToken=' + localStorage.getItem('lobbyToken')
                + '?userToken=' + localStorage.getItem('userToken'));

            localStorage.removeItem('lobbyToken');

        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }

    }

    //alkjdslöfha

    getLobbyToken(){
        return this.state.lobbyToken;
    }

    async getLobby(){
        try {
            const response = await api.get('/lobby?lobbyToken='+ localStorage.getItem('lobbyToken'));

/*            await new Promise(resolve => setTimeout(resolve, 1000));*/

            // Get the returned users and update the state.
            this.setState({
                playerList: response.data.playerList
            });

            // See here to get more data.
            console.log(response.data.playerList);
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    ready(){
        try {
            const requestBody = JSON.stringify({
                lobbyToken: localStorage.getItem('lobbyToken'),
                /*                password: this.state.password,*/
                userToken: localStorage.getItem('userToken'),
                status: "READY"
            });
            const response = api.put('/lobby/ready?userToken=' + localStorage.getItem('userToken')
                + '?gameToken=' + localStorage.getItem('userToken'), requestBody);


        }catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    enterGame(){
        try {
            const response = api.put('/lobby/' + localStorage.getItem('lobbyToken')
                + '/game');

            console.log(response);
            console.log(response.data);
            localStorage.setItem('gameToken', localStorage.getItem('lobbyToken'));
            console.log(localStorage.getItem('gameToken'))

            this.props.history.push('/unityGame');

        }catch (error) {
            alert(`Ivan is a dictator \n${handleError(error)}`);
        }
    }

    componentWillMount() {
        const response = api.get('/lobby?lobbyToken=' + localStorage.getItem('lobbyToken'))


        const lobby = new Lobby(response.data);


        this.setState({
            playerList: lobby.playerList,
            botList: lobby.botList
        })

    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.getLobby(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    render() {
        return (
            <BaseContainer>
            <Container>
                <h2>Players </h2>
                <div>
                    {!this.state.playerList ? (
                        <Spinner />
                    ) : (
                        <div>
                            <Users>
                                {this.state.playerList.map(user => {
                                    return (
                                        <PlayerContainer
                                            key={user.id}
                                            onClick={() => {
                                                console.log(user.id)
                                                /*nothing happens but a console log*/
                                            }}>
                                            <Player user={user}/>
                                        </PlayerContainer>
                                    );
                                })}
                            </Users>
                        </div>
                    )}
                        <Button
                            width="30%"
                            onClick={() => {
                                this.leaveLobby();
                            }}
                        >
                            Leave
                        </Button>

                    <Button
                        disabled = {localStorage.getItem('userToken') !== this.state.adminToken}
                        width="30%"
                        onClick={() => {
                            this.getLobbyToken();
                        }}
                    >
                        Get the lobby token
                    </Button>
                    </div>

                <Button
                    onClick={() => {
                        this.enterGame();
                    }}
                >
                    Join into Game
                </Button>

            </Container>
            </BaseContainer>
        );
    }
}

export default withRouter(WaitingRoom);
