import React from "react";
import styled from "styled-components";
import Logo from "./Logo.png";
import {api, handleError} from "../helpers/api";
import { Button } from "./design/Button";
import  { Redirect } from 'react-router-dom';


const Container = styled.div`
  height: ${props => props.height}px;
  background: ${props => props.background};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Container2 = styled.div`
  height: ${props => props.height}px;
  background: ${props => props.background};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Spaceleft= styled.div`
    margin-left: 533px;
`;


async function logout() {

    const key = localStorage.getItem(('userToken'));
    try {
        await api.put('/logout?token=' + key);
    } catch (error) {
        alert(`Something went wrong while logging out: \n${handleError(error)}`);
    }
    localStorage.removeItem('userToken');


}

const Header2 = props => {



    return (
        <Container height={props.height}>

            <img src={Logo} width="100px"/>
            <Spaceleft>
                <Button
                    onClick={() => {
                        logout().then(r => <Redirect to='/login'  />);
                    }}
                >
                    Logout
                </Button>
            </Spaceleft>
        </Container>
    );
};

export default Header2;
