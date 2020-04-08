import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

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
    constructor() {
        super();
        this.state = {
            user1: null,
            id1: null,
            user2: null,
            id2: null,
            user3: null,
            id3: null,
            user4: null,
            id4: null,
            user5: null,
            id5: null,
            user6: null,
            id6: null,
            user7: null,
            id7: null
        };
    }

    showProfile(id){
        this.props.history.push({
            pathname: '/dashboard/profile?{username}',
            id: id
        })
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

            // This is just some data for you to see what is available.
            // Feel free to remove it.
            console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);

            // See here to get more data.
            console.log(response);
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    render() {
        return (
            <Container>
                <h2>Players </h2>
                <div>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.leaveLobby();
                            }}
                        >
                            Leave
                        </Button>
                    </div>
                )}
            </Container>
        );
    }
}

export default withRouter(WaitingRoom);
