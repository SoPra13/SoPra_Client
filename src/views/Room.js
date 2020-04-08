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


const Room = ({ lobby }) => {
    return (
        <Container>
            <Name>{lobby.name}</Name> <UserName>{lobby.username}</UserName>
        </Container>
    );
};

export default Room;
