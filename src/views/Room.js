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
  background: rgba(0,38,176, 0.7);
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  color: #FFA700;
  font-weight: lighter;

`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;

const Room = ({ lobby }) => {
    return (
        <Container>
            <UserName>{lobby.lobbyName}</UserName>
        </Container>
    );
};

export default Room;
