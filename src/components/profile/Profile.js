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
  color: #ffffff;
  text-align: center;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const central = styled.div`
  text-align: center;
`;

const LoginForm = styled.div`
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