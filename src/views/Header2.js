import React from "react";
import styled from "styled-components";
import Logo from "./Logo.png";
import {api, handleError} from "../helpers/api";
import { Button } from "./design/Button";
import  { Redirect } from 'react-router-dom';

const EmptyBox = styled.div`
  width: 100px;
`;
const Container = styled.div`
  height: ${props => props.height}px;
  background: ${props => props.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container2 = styled.div`
  color: rgba(255, 255, 255, 0);
  width: 100px;
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
            <EmptyBox/>

<img src={Logo} height="100px" width="100px"/>
            <Button
                position = "absolute"
                onClick={() => {
                    this.props.history.push('/dashboard/customLobby');
                }}
            >
                Create Lobby
            </Button>
        </Container>
    );
};

export default Header2;
