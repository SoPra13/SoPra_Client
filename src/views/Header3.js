import React from "react";
import styled from "styled-components";
import Logo from "./Logo.png";


const Container = styled.div`
  height: ${props => props.height}px;
  background: ${props => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header3 = props => {

    return (
        <Container height={props.height}>

            <img src={Logo} width="100px"/>
        </Container>
    );
};

export default Header3;
