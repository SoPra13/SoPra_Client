import React, { Component } from 'react';
import styled from 'styled-components';
import { Message } from '../../components/chat/Message';

const Form = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
width: 400px;
height: 375px;
font-size: 16px;
font-weight: 300;
border-radius: 5px;
padding: 25px;
background-color: #ffca65;
transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Chatbox = styled.div`
display: box;
padding-left: 5px;
background-color: brown;
border-radius:5px;
margin-bottom:10px;
overflow: scroll;
overflow-x: hidden;
overflow-y: scroll;
::-webkit-scrollbar {
    width: 10px;
    border-radius: 5px;
  }
::-webkit-scrollbar-track {
    background: #f1f1f1; 
    border-radius: 2px;
  }
::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 2px;
  }
::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
`;

export default class Chat extends Component {
    render() {
        return (
            <div>
                <Form>
                <Chatbox>
                    <Message username="dora" message="hello"/>
                    <Message username="urs" message="hello"/>
                    <Message username="vora" message="hehe "/>
                    <Message username="dora" message="mimimi"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </Chatbox>
                <div>
                <input type="text" name="usermsg" id=""/>
                <button type="submit">Send</button>
                </div>
                </Form>
            </div>
        )
    }
    componentDidMount() {
        this.messagesEnd.scrollIntoView();
    }

}
