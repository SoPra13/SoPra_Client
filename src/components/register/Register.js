import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';

import'../profile/dropdownAvatar.css';

import Avenger from '../../image/avatar/Avenger.png';
import Lion from '../../image/avatar/Lion.png';
import Magneto from '../../image/avatar/Magneto.png';
import Meow from '../../image/avatar/Meow.png';
import MsWednesday from '../../image/avatar/MsWednesday.png';
import Robot from '../../image/avatar/Robot.png';
import Urgot from '../../image/avatar/Urgot.png';

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
  width: 30%;
  height: 590px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: rgba(9, 5, 88, 0.75);
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Central = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CentralRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;


const InputField = styled.input`
  &::placeholder {
    color: rgba(248, 248, 148);
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

const Label = styled.label`
  color: rgba(248, 248, 148);
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
`;

const Advice = styled.div`
  color: rgba(248, 248, 148);
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Register extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            username: null,
            password: null,
            confirmation: null,
            avatar: 1
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end
     * and its token is stored in the localStorage.
     */
    async register() {
        if(1<=this.state.username.length && this.state.username.length<9){
            if(0<this.state.password.length && this.state.password.length<33) {
                if (this.state.confirmation === this.state.password) {
                    try {
                        const requestBody = JSON.stringify({
                            username: this.state.username,
                            password: this.state.password,
                            avatar: this.state.avatar
                        });
                        await api.post('/register', requestBody);

                        /*            // Get the returned user and update a new object.
                                    const user = new User(response.data);

                                    // Store the token into the local storage.
                                    localStorage.setItem('userToken', user.userToken);*/

                        this.props.history.push(`/login`);
                    } catch (error) {
                        alert(`Something went wrong during the sign up: \n${handleError(error)}`);
                    }
                } else {
                    alert("Your passwords aren't identical.");
                }
            }else{
            alert("Please set a password of length 1-32.");
        }
        }else{
            alert("Your username has to be min 1 and max 8 characters");
        }
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    setAvatar(x){
        console.log(x);
        this.setState({
            avatar: x
        });
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

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {}

    render() {
        return (
            <FormContainer>
                <Form>
                    <Label>Oh dear! Need a new Account?</Label>

                    <Advice>Here some advices: Choose an Avatar you like. Username can take a length of 1-8 characters
                        and the password a length of 1-32. Don't forget to repeat the password
                        and press "Sign up"-button.</Advice>
                    <br/>


                    <CentralRow>
                    <img src={this.getAvatar(this.state.avatar)} width='60px' height='60px'/>
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
                    </CentralRow>




                    <Label>Username</Label>
                    <InputField
                        placeholder="Enter here your username"
                        onChange={e => {
                            this.handleInputChange('username', e.target.value);
                        }}
                    />
                    <Label>Password</Label>
                    <InputField type="password"
                                placeholder="Enter here your password"
                                onChange={e => {
                                    this.handleInputChange('password', e.target.value);
                                }}
                    />

                    <InputField type="password"
                                placeholder="Repeat your password"
                                onChange={e => {
                                    this.handleInputChange('confirmation', e.target.value);
                                }}
                    />



                    <ButtonContainer>
                        <Central>
                            <Button
                                disabled={!this.state.username || !this.state.password}
                                width="30%"
                                onClick={() => {
                                    this.register();
                                }}
                            >
                                Sign up
                            </Button>

                            <Button
                                width="30%"
                                onClick={() => {
                                    this.props.history.push(`/login`);
                                }}
                            >
                                Back
                            </Button>
                        </Central>
                    </ButtonContainer>
                </Form>
            </FormContainer>
        );
    }
}

export default withRouter(Register);
