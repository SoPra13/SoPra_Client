import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import Header from "../../views/Header";

const Central = styled.div`
  display: flex;
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
  width: 30%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background-color: rgba(48,208,255,0.4);
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
  background: rgba(255, 255, 255, 0.3);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;


const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
`;

/**
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class LoginLobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lobbyname: null,
            userToken: localStorage.getItem(`userToken`),
            lobbyToken: null,
            joinToken: null
        };
    }

    async login() {
        try {
            const response = await api.put('/lobby?joinToken='+ this.state.joinToken +
                `&userToken=` + localStorage.getItem('userToken'));

            // Get the returned user and update a new object.
            console.log(response.data);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store the token into the local storage.
            localStorage.setItem('lobbyToken', response.data.lobbyToken);

            this.props.history.push('/dashboard/waitingLobby');
        } catch (error) {
            alert(`Something went wrong during the lobbyJoin: \n${handleError(error)}`);
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

    componentDidMount() {}

    render() {
        return (
            <div>        <Header height={"80"} />
                <BaseContainer>
                    <FormContainer>
                        <Form>



                            <Label>Password</Label>
                            <InputField
                                type="password"
                                placeholder="Enter here your lobby token"
                                onChange={e => {
                                    this.handleInputChange('joinToken', e.target.value);
                                }}
                            />
                            <ButtonContainer>

                                <Central>
                                    <Button
                                        disabled={!this.state.joinToken}
                                        onClick={() => {
                                            this.login();
                                        }}
                                    >
                                        Enter Lobby
                                    </Button>
                                </Central>
                                <br/>
                                <Central>
                                    <Button
                                        width="35%"
                                        onClick={() => {
                                            this.props.history.push('/dashboard');
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Central>

                            </ButtonContainer>
                        </Form>
                    </FormContainer>
                </BaseContainer>
            </div>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(LoginLobby);
