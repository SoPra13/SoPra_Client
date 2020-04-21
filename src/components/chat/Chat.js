import React, { Component } from 'react';
import { Message } from '../../components/chat/Message';
import '../../components/chat/chat.css'
import { api, handleError } from '../../helpers/api';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: [], msginput: ""}
        this.updateInputText = this.updateInputText.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleSendOnEnter = this.handleSendOnEnter.bind(this);
    }
    render() {   
        return (
            <div>
                <div className="form">
                    <div className="chatbox">
                        {this.state.messages.map(msg =>(<Message username={msg.username} message={msg.message}/>))}
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="submitbox">
                        <input type="text" className="usermsg" id="" value={this.state.msginput} onKeyUp={this.handleSendOnEnter} onChange={this.updateInputText}/>
                        <button type="submit" className="submit"  onClick={this.handleSend}>Send</button>
                    </div>
                </div>
            </div>
        )
    }

    handleSend(event) {
        if (this.state.msginput !== "") {
            const json = JSON.stringify({userToken: localStorage.userToken, message: this.state.msginput})
            api.post("/chat", json, {params: {lobbytoken: "hihi"}});
            this.setState({msginput: ""})
        }
    }

    handleSendOnEnter(event) {
        if (event.key === 'Enter') {
            this.handleSend();
        }
    }

    updateInputText(event) {
        console.log(event.target)
        this.setState({msginput: event.target.value});
    }

    componentDidMount() {
        this.scrollchat();
        this.timerID = setInterval(() => {
            this.fetchUser();
        }, 200);
    }

    componentDidUpdate() {
        this.scrollchat()
    }

    scrollchat() {
        this.messagesEnd.scrollIntoView();
    }

    async fetchUser() {
        try {
            const response = await api.get('/chat', {params: {lobbytoken: "hihi"}});
            if (this.state.messages.length < response.data.length) {
                this.setState({messages: response.data}); 
            }
        } catch (error) {
            alert(error)
        }
    }

    getRows = () => {
        console.log("rendering");
        console.log(this.state.messages);
        const rows = [];
        for (const msg in this.state.messages) {
            rows.push(<Message username={msg.username} message={msg.message}/>)
        }
        return rows;
    }

}
