import React from "react";
import styled from "styled-components";
import JustOne1 from "../image/JustOne1.png";


const Container = styled.div`
  margin: 6px 0;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
    flex-direction: column;
      justify-content: center;
  border: 1px solid #ffffff26;
`;

const JO = styled.img`
height: 50%;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const FormContainer2 = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 300px;
  justify-content: center;
  overflow: auto;
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

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
function Gamedescription() {
    return (

        <Container>
        <FormContainer>
            <FormContainer>


                <FormContainer2>
                <img style={{width: "50%"}} src={JustOne1} alt=""/>
                <FormContainer>
                <h1>OBJECT OF THE GAME</h1>


                <TextContainer>

            <p>
                Just One is a cooperative party game.
                You all play together to get the best score!
                Together, make one of the players – the active player–
                guess a Mystery word by secretly writing a clue on
                your easel.
                Choose your clue without coordinating with each other
                and be original so as not to write the same clue as another player, as all identical clues will be canceled before
                the active player gets to see them.
                At the end of the game, tally your score based on the
                number of Mystery words found.
            </p>
                </TextContainer>

                </FormContainer>
                    </FormContainer2>
                </FormContainer>

        <FormContainer>
                <h1>SETUP</h1>
            <TextContainer>
                 <p>
                1) Shuffle the cards and randomly draw 13 to create a
                face-down deck in the middle of the table. Return
                the remaining cards to the box, they will not be used
                this game.
                2) Give an easel and an erasable felt marker to each player.
                3) Randomly choose a player to be the first active player.
            </p>
                </TextContainer>
        </FormContainer>

        </FormContainer>
        </Container>

    );
};

export default Gamedescription;
