import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  text-align: center;
    background: rgba(120, 26, 89, 0.8);
  border: 1px solid #ffffff26;
`;

const LobbyName = styled.div`
  color: #F8F894;
  font-weight: lighter;
`;

const Room = ({ lobby }) => {
    return (
        <Container>
            <LobbyName>{lobby.lobbyName}</LobbyName>
        </Container>
    );
};

export default Room;
