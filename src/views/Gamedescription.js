import React from "react";
import styled from "styled-components";
import JustOne1 from "../image/JustOne1.png";


const Container = styled.div`

  color: rgba(248, 248, 148, 1);;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;
const Container2 = styled.div`

  color: rgba(248, 248, 148, 1);;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
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

const Background = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 630px;
  justify-content: center;
    background: rgba(120, 26, 89, 0.8);
`;

const Background2 = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 500px;
  justify-content: center;
  padding: 20px;
    background: rgba(120, 26, 89, 0.8);
      border-radius: 20px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 500px;
  justify-content: center;
  overflow: hidden;
  
`;

const FormList1 = styled.ol`
`;

const FormList2 = styled.ul`
  list-style-type: square;
`;

const FormList3 = styled.ul`
  list-style-type: circle;
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
        <Container2>
            <FormContainer>
                <Container>
                    <FormContainer>


                        <FormContainer2>
                            <img style={{width: "50%"}} src={JustOne1} alt=""/>
                            <FormContainer>
                                <Background2>
                                <h1>OBJECT OF THE GAME</h1>


                                <TextContainer>

                                    <p>
                                        Just One Web is a cooperative multiplayer online party game, where teams of players
                                        compete together to reach the highest scores. Each round one player on a team is
                                        the guesser that needs to guess the Topic Word using the clues the teammates
                                        (in the role of clue-givers) provide. But be careful, the most obvious clues are
                                        not always the most helpful. Then if two or more clues are similar, they all get
                                        eliminated. So be original and come up with unique clues. The game starts once at
                                        least 3 players have joined the lobby. If you don’t have enough player, you may
                                        fill the empty slots with friendly or malicious Bots. There is a maximum of 7
                                        slots per game. Once you start a game a deck of 13 randomly chosen Topic cards
                                        will be set in the middle of the game field. The first guesser is chosen randomly
                                        at the initiation of the first round. Players take turns until the deck in the
                                        middle of the circle is empty. Furthermore, each round consists of 4 phases,
                                        namely the ”Topic Choice Phase”, the “Clue Phase”, the “Guess Phase” and the
                                        “Evaluation Phase”.
                                    </p>
                                </TextContainer>
                                </Background2>
                            </FormContainer>
                        </FormContainer2>

                    </FormContainer>
                </Container>

                <Container2>
                    <FormContainer>
                        <Background>
                            <h1>Phase Overview:</h1>

                            <FormList1>
                                <li>The teammates vote a topic out of 5 possible topics. The topic with the most votes will get selected for this round
                                </li>
                                <li>Each player then must come up with a clue on their own. The input field does not allow invalid clues to be submitted. Invalid clues:
                                    <FormList2>
                                        <li>Contains more than one word</li>
                                        <li>The Mystery word but written differently
                                        </li>
                                        <li>The Mystery word written in a foreign Language.
                                        </li>
                                        <li>A word from the same family as the Mystery word.
                                        </li>
                                        <li>An Invented word.</li>
                                        <li>Can not be a homophone or the homograph of the Mystery word
                                        </li>
                                    </FormList2>
                                </li>
                                <li>In the clue elimination stage, all invalid and identical clues are eliminated.
                                    Identical clues:
                                    <FormList2>
                                        <li>Homographs</li>
                                        <li>Variants from the same word family.</li>
                                        <li>Variants of the same word.</li>
                                    </FormList2>
                                </li>
                                <li>Then the active player has one guess to find the Mystery word from the remaining clues.
                                    <FormList2>
                                        <li>Success – active player guessed the correct word.
                                            <FormList3>
                                                <li>All player with remaining clues and the active player are awarded points depending on the time it took them to find their clue/word.</li>
                                            </FormList3>
                                        </li>
                                        <li>Failure – active player guessed the wrong word.
                                            <FormList3>
                                                <li>No one gets points</li>
                                                <li>Discard the next card on the deck</li>
                                            </FormList3>
                                        </li>
                                        <li>Skip – if the active player does not want to risk losing a card he can skip his turn.
                                            <FormList3>
                                                <li>No one gets points</li>
                                            </FormList3>
                                        </li>
                                    </FormList2>
                                    Then the player to the left is the active player and the next turn begins.
                                    The game ends if the deck in the middle of the circle is empty. The final score for each player is calculated by multiplying the sum of all points awarded at the end of each turn by the square of the number of correct guessed Mystery words.
                                </li>

                            </FormList1>
                        </Background>
                    </FormContainer>
                </Container2>

            </FormContainer>
        </Container2>

    );
}

export default Gamedescription;
