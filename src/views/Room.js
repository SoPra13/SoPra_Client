import React from "react";
import styled from "styled-components";

import Magneto from "../image/avatar/Magneto.png";
import Avenger from "../image/avatar/Avenger.png";
import Robot from "../image/avatar/Robot.png";
import MsWednesday from "../image/avatar/MsWednesday.png";
import Lion from "../image/avatar/Lion.png";
import Meow from "../image/avatar/Meow.png";
import Urgot from "../image/avatar/Urgot.png";

const Form = styled.div`
    display: flex;
    justify-content: center; 
    flex-direction: column;
`;

const Form2 = styled.div`
    display: flex;
    justify-content: space-between; 
    flex-direction: row;
`;

const Container = styled.div`
  margin: 6px 0;
  width: 300px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  background: rgba(120, 26, 89, 0.8);
  border: 1px solid #ffffff26;
  
`;

const Container2 = styled.div`
  margin: 6px 0;
  width: 450px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
    background: rgba(120, 26, 89, 0.8);
  border: 1px solid #ffffff26;
`;



const LobbyName = styled.div`
  color: #F8F894;
  font-weight: lighter;
`;

const NumberOfPlayers= styled.div`
  color: #F8F894;
  font-weight: lighter;
`;

const Rank = styled.div`
  color: #FFBB18;
`;

function getAvatar(avatar){
    var x = avatar;

    switch (x) {
        case 1:
            return Magneto;
        case 2:
            return Avenger;
        case 3:
            return Urgot;
        case 4:
            return MsWednesday;
        case 5:
            return Lion;
        case 6:
            return Meow;
        case 7:
            return Robot;
    }
}

const Room = ({ lobby }) => {

return (
    <Container>
        <Form2>
            <Form>
                <img src={getAvatar(3)} width="85px" height="85px"/>
                <NumberOfPlayers>#Bots: {lobby.botList.length}</NumberOfPlayers>
            </Form>
        <Form>
            <LobbyName>Lobby name: {lobby.lobbyName}</LobbyName>
        </Form>
            <Form>
                <img src={getAvatar(lobby.playerList.length)} width="85px" height="85px"/>
            <NumberOfPlayers>#Players: {lobby.playerList.length}</NumberOfPlayers>
            </Form>

        </Form2>
    </Container>
);
};

export default Room;
