import React, { Component } from 'react';
import { BaseContainer } from '../../helpers/layout';
import { Message } from '../../components/chat/Message';

export default class Chat extends Component {
    render() {
        return (
            <div>
                <BaseContainer>
                <div id="chatbox">
                    <Message username="dora" message="hello"/>
                    <Message username="urs" message="hello"/>
                    <Message username="vora" message="hehe "/>
                    <Message username="dora" message="mimimi"/>
                    <Message username="mora" message="lass mich in ruhe"/>
                </div>
                <div>
                <input type="text" name="usermsg" id=""/>
                <button type="submit">Send</button>
                </div>
                </BaseContainer>
            </div>
        )
    }
}
