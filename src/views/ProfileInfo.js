import React from "react";
import styled from "styled-components";

import Magneto from "../image/avatar/Magneto.png";
import Avenger from "../image/avatar/Avenger.png";
import Robot from "../image/avatar/Robot.png";
import MsWednesday from "../image/avatar/MsWednesday.png";
import Lion from "../image/avatar/Lion.png";
import Meow from "../image/avatar/Meow.png";
import Urgot from "../image/avatar/Urgot.png";



import Bronze from '../image/rank/Bronze.png'
import Silver from '../image/rank/Silver.png'
import Gold from '../image/rank/Gold.png'
import Diamond from '../image/rank/Diamond.png'
import GrandMaster from '../image/rank/GrandMaster.png'


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

const Red = styled.div`
  color: #F60000;
`;

const Green = styled.div`
  color: #1CD200;
`;

const Rank = styled.div`
  color: #FFBB18;
`;

const UserName = styled.div`
  color: #F8F894;
  font-weight: lighter;
  margin-left: 5px;
`;

const OnlineStatus = styled.div`
  font-weight: bold;
  color: #0e3d61;
`;

/**
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

function getAvatar(avatar){
    var x = avatar;

    switch (x) {
        case 1:
            return Magneto;
        case 2:
            return Avenger;
        case 3:
            return Robot;
        case 4:
            return MsWednesday;
        case 5:
            return Lion;
        case 6:
            return Meow;
        case 7:
            return Urgot;
    }
}

function ranking(score){
    if(score<100){
        return Bronze;
    }else if(100<=score && score<200){
        return Silver;
    }else if(200<=score && score<300){
        return Gold;
    }else if(300<=score && score<400){
        return Diamond;
    }else{
        return GrandMaster;
    }
}

function rankingName(score){
    if(score<100){
        return "Noob";
    }else if(100<=score && score<200){
        return "Casual";
    }else if(200<=score && score<300){
        return "Pro";
    }else if(300<=score && score <400){
        return "Veteran";
    }else{
        return "Master";
    }
}


const ProfileInfo = ({ user }) => {
    return (
        <Container>
            <Form2>
                <img src={getAvatar(user.avatar)} width="80px" height="80px"/>
                <Form>
                    <UserName>{user.username}</UserName>
                    <OnlineStatus>{user.status === "ONLINE" ? <Green>ONLINE</Green> : <Red>OFFLINE</Red>}</OnlineStatus>
                </Form>
                <Form>
                    <img src={ranking(user.totalScore)} width="60px" height="60px"/>
                    <Rank>{rankingName(user.totalScore)}</Rank>
                </Form>

            </Form2>
        </Container>
    );
};

export default ProfileInfo;