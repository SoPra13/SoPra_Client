import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
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
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

class EditProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            id: null,
            username: null
        };
    }

    //update user
    async update() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
            });

            const response = await api.put('/users/' + this.state.id, requestBody);
            this.props.history.push({
                pathname: '/dashboard/profile',
                id: this.state.id
            })


        } catch (error) {
            alert(`Something went wrong during updating: \n${handleError(error)}`);
        }
    }

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }


    //called after mounting
    async componentDidMount() {
        try {
            console.log(this.state.id)
            const response = await api.get('/users/' + this.state.id);

            this.setState({ user: response.data });
            console.log(this.state.user)
            console.log(this.state.id)
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }


    render() {
        return (
            <Container>
                <h2>EditProfile</h2>
                {!this.state.user ? (
                    <Spinner />
                ) : (
                    <BaseContainer>
                        <FormContainer>
                            <Form>
                                <Label>Username</Label>
                                <InputField
                                    placeholder="Enter here.."
                                    onChange={e => {
                                        this.handleInputChange('username', e.target.value);
                                    }}
                                />
                            </Form>
                        </FormContainer>
                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username}
                                width="30%"
                                onClick={() => {
                                    this.update()
                                }}
                            >
                                Save
                            </Button>
                        </ButtonContainer>
                    </BaseContainer>
                )}
                <ButtonContainer>
                    <Button
                        width="30%"
                        onClick={() => {
                            this.props.history.push(`/dashboard`);
                        }}>
                        Back
                    </Button>
                </ButtonContainer>
            </Container>
        )

    }
}

export default withRouter(EditProfile);