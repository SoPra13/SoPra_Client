import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Lobby from "../shared/models/Lobby";

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
            lobbyToken: null
        };
    }

    leaveLobby(){
        const response = api.delete(`/lobby` + `?lobbyToken={lobbyToken}` + localStorage.getItem('token')
        + `?userToken={userToken}` +  localStorage.getItem('token'))
    }

    getLobbyToken(){
        return this.lobbyToken;
    }

    async getLobby(){
        try {
            const response = await api.get(`/lobby`+`?token={token}`+ localStorage.getItem('token'));

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            this.setState({ users: response.data });

            // See here to get more data.
            console.log(response);
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
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
                        width="30%"
                        onClick={() => {
                            this.getLobbyToken();
                        }}
                    >
                        Leave
                    </Button>
                    </div>
                )}
            </Container>
            </BaseContainer>
        );
    }
}

export default withRouter(WaitingRoom);
