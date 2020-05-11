import React from "react";
import styled from "styled-components";


const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:  #ed782f;
  border: 1px solid #ffffff26;
  
`;

const UserName = styled.div`
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
const ProfileInfo = ({ user }) => {
    return (
        <Container>
            <UserName>{user.username}</UserName>
            <OnlineStatus>{user.status}</OnlineStatus>
        </Container>
    );
};

export default ProfileInfo;