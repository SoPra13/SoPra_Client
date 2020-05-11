import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import ProfileInfo from "../../views/ProfileInfo";
import Header from "../../views/Header";

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
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
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
            <div>        <Header height={"80"} />
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
            </div>
        );
    }
}

export default withRouter(Profile);