import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Header2 from "../../views/Header2";
import DropdownAvatar from './dropdownAvatar.css';

import Avenger from '../../image/avatar/Avenger.png';
import Lion from '../../image/avatar/Lion.png';
import Magneto from '../../image/avatar/Magneto.png';
import Meow from '../../image/avatar/Meow.png';
import MsWednesday from '../../image/avatar/MsWednesday.png';
import Robot from '../../image/avatar/Robot.png';
import Urgot from '../../image/avatar/Urgot.png';

const Title = styled.div`
 color: #FFC100;
 text-shadow: -1px 0 blue, 0 1px red, 1px 0 red, 0 -1px red;
`;

const Central = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Title2= styled.div`
    color: rgba(248, 248, 148, 1);
`;

const Container = styled(BaseContainer)`
  text-align: center;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FormContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
`;

const FormContainer3 = styled.div`
  display: flex;
  flex-direction: column;
`;


const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: rgba(9, 5, 88, 0.75);
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
        color: rgba(248, 248, 148, 1);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(120, 26, 89, 0.8);
  color: rgba(248, 248, 148);
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
            username: null,
            avatar: null
        };
    }


    //update user
    async update() {
        if(1<=this.state.username.length && this.state.username.length<9){
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                avatar: this.state.avatar
            });
            console.log(requestBody);

            await api.put('/user?token=' + localStorage.getItem('userToken'), requestBody);
            this.props.history.push('/dashboard');


        } catch (error) {
            alert(`Something went wrong during updating: \n${handleError(error)}`);
        }
        }else{
            alert("Your username has to be min 1 and max 8 characters");
        }
    }

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    setAvatar(x){
        console.log(x);
        this.setState({
           avatar: x
        });
        console.log(this.state.avatar);
    }

    getAvatar(avatar){
        var x = avatar;

        switch (x) {
            case 1:
                return Magneto;
            case 2:
                return Avenger;
            case 3:
                return Robot;
            case 4:
                return MsWednesday;
            case 5:
                return Lion;
            case 6:
                return Meow;
            case 7:
                return Urgot;
        }
    }


    async componentWillMount() {
        try {
            const response = await api.get('/user/?token=' + localStorage.getItem('userToken'));

            this.setState({
                user: response.data,
                username: response.data.username,
                avatar: response.data.avatar
            });

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }


    render() {
        return (
            <div>        <Header2 height={"80"} />
            <Container>
                <h2><Title>EditProfile</Title></h2>


                </Container>


                {!this.state.user ? (
                    <Spinner />
                ) : (
                    <BaseContainer>

                        <FormContainer>
                            <Form>
                                <Container>
                                    <FormContainer2>

                                        <FormContainer3>
                                            <Label><Title2>Username</Title2></Label>
                                            <Central>
                                            <img src={this.getAvatar(this.state.avatar)} width='60px' height='60px'/>
                                            </Central>
                                            <br/>
                                            <InputField
                                                placeholder="Enter here a new username"
                                                onChange={e => {
                                                    this.handleInputChange('username', e.target.value);
                                                }}
                                            />
                                        </FormContainer3>
                                    </FormContainer2>

                                    <div className="dropdown">
                                        <button className="dropbtn">Change Avatar</button>
                                        <div className="dropdown-content">
                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(1)
                                                    }}>
                                                <img src={Magneto} width='40px' height='40px'/>
                                            </button>

                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(2)
                                                    }}>
                                                <img src={Avenger} width='40px' height='40px'/>
                                            </button>
                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(3)
                                                    }}>
                                                <img src={Robot} width='40px' height='40px'/>
                                            </button>
                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(4)
                                                    }}>
                                                <img src={MsWednesday} width='40px' height='40px'/>
                                            </button>
                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(5)
                                                    }}>
                                                <img src={Lion} width='40px' height='40px'/>
                                            </button>
                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(6)
                                                    }}>
                                                <img src={Meow} width='40px' height='40px'/>
                                            </button>
                                            <button className="transparent"
                                                    onClick={() => {
                                                        this.setAvatar(7)
                                                    }}>
                                                <img src={Urgot} width='40px' height='40px'/>
                                            </button>

                                        </div>
                                    </div>

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
                            </Form>
                        </FormContainer>

                    </BaseContainer>
                )}

            </div>
        )

    }
}

export default withRouter(EditProfile);