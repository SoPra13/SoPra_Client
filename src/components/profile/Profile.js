import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";
import ProfileInfo from "../../views/ProfileInfo";

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

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            id: null
        };
    }

    //called before mounting
    componentWillMount()
    {
        if (this.props.history.location.id) {
            let id = this.props.history.location.id;
            this.setState({ id });
        }
    }

    //called after mounting
    async componentDidMount() {
        try {
            const response = await api.get('/users/' + this.state.id);
            this.setState({ user: response.data });
            console.log(this.state.user)
        } catch (error) {
            alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
        }
    }


    render() {

        return (
            <Container>
                <h2>Profile</h2>
                {!this.state.user ? (
                    <Spinner />
                ) : (
                    <div>
                        <Users>
                            <PlayerContainer key={this.state.user.id}>
                                <ProfileInfo user={this.state.user}/>
                            </PlayerContainer>
                        </Users>

                    </div>
                )}

                <ButtonContainer>
                    <Button
                        width="30%"
                        onClick={() => {this.props.history.push(`/dashboard`);}}
                    >
                        Back
                    </Button>
                </ButtonContainer>
            </Container>
        );
    }
}

export default withRouter(Profile);