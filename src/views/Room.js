import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
`;

const Name = styled.div`
  font-weight: bold;
  color: #5a5a5a;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;

const Room = ({ lobby }) => {
    return (
        <Container>
            <UserName>{lobby.lobbyname}</UserName>
            <Id>Id: {lobby.id}</Id>
        </Container>
    );
};

export default Room;
