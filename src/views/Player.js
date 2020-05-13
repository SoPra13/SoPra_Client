import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  background:  #ed782f;
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
`;
const LobbyName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;


const Lobby = ({ lobby }) => {
    return (
        <Container>
            <LobbyName>{lobby.lobbyName}</LobbyName>
        </Container>
    );
};

const Player = ({ user }) => {
  return (
    <Container>
        <UserName>{user.username}</UserName>
    </Container>
  );
};

export default Player;
