import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Button2} from "../../views/design/RegisterButton";
import Logo from "./Logo.png";


import classes from '../login/login.css';

const Central1 = styled.div`
  color: #FFC100;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
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
  width: 350px;
  height: 425px;
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

const Central = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
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
class Login extends React.Component {
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
      theme: 'light'
    };
  }

  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */


  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.put('/login', requestBody);

/*        try {
            const respo = await api.get('/user/?token=' + response.data);
            console.log(respo.data);
            if(respo.data.status=== "ONLINE"){*/
                localStorage.setItem('userToken', response.data);

                this.props.history.push(`/dashboard`);
/*            }
            else{
                alert("User is already logged in.")
            }*/

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
/*  }*/


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
        <div>

          <body>
          <div>

          <Central1>
            <h1><img src={Logo} width='60px' height='60px'/> Welcome to Town!! <img src={Logo} width='60px' height='60px'/></h1>
          </Central1>
            <FormContainer>


              <Form>


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
                <ButtonContainer>

                  <Central>
                    <Button
                        disabled={!this.state.username || !this.state.password}
                        width="30%"
                        onClick={() => {
                          this.login();
                        }}
                    >
                      Login
                    </Button>
                  </Central>
                  <br/>
                  <Central>
                    <Button2
                        onClick={() => {
                          this.props.history.push('/register');
                        }}
                    >
                      Hey Buddy! New in the city? Wanna kill Time? Come and <span style={{color: "#FFC100"}}>sign up here</span>.
                    </Button2>
                  </Central>
                    <br/>
                    <Central>
                        <Button
                            onClick={() => {
                                this.props.history.push('/leaderboard');
                            }}
                        >
                            Leaderboard
                        </Button>
                    </Central>
                </ButtonContainer>
              </Form>
            </FormContainer>

          </div>
          </body>
        </div>

    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
