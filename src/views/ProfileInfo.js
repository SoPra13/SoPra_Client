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
const label = styled.div`
  font-weight: bold;
  color: #06c4ff;
`;
const onlineStatus = styled.div`
  font-weight: bold;
  color: #06c4ff;
`;
const creationDate = styled.div`
  font-weight: bold;
  color: #06c4ff;
`;
const birthDate = styled.div`
  font-weight: bold;
  color: #06c4ff;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const ProfileInfo = ({ user }) => {
    return (
        <Container>
            <UserName>{user.username}</UserName>
            <onlineStatus>{user.status}</onlineStatus>
        </Container>
    );
};

export default ProfileInfo;