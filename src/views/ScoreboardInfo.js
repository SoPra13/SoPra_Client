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

const Name = styled.div`
  font-weight: bold;
  color: #06c4ff;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;


const ScoreboardInfo = ({ scoreboard }) => {
    return (
        <Container>
            <UserName>{scoreboard.playerList}</UserName>
            <Id>Id: {scoreboard.teamScore}</Id>
        </Container>
    );
};

export default ScoreboardInfo;
