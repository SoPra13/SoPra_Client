import React, { Component } from 'react';
import { Message } from '../../components/chat/Message';
import '../../components/chat/chat.css'
import { api } from '../../helpers/api';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: [], msginput: "", active:true}
        this.updateInputText = this.updateInputText.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleSendOnEnter = this.handleSendOnEnter.bind(this);
    }
    render() {   
        return (
                <div className="form">
                    <div className="chatbox">
                        {this.state.messages.map(msg =>(<Message username={msg.username} message={msg.message}/>))}
                        {!this.state.active?<p style={{color:"red"}}>Chat closed!</p>:<div style={{ float:"left", clear: "both" }}/>}
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="submitbox">
                        <input type="text" className="usermsg" id="" value={this.state.msginput} onKeyUp={this.handleSendOnEnter} onChange={this.updateInputText}/>
                        <button type="submit" className="submit"  onClick={this.handleSend}>Send</button>
                    </div>
                </div>
        )
    }

    handleSend() {
        if (this.state.msginput !== "" && this.state.active) {
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
        this.setState({msginput: event.target.value});
    }

    async updateStatus() {
        const response = await api.get('/chat/active', {params: {lobbytoken: "hihi"}});
        if (this.state.active !== response.data) {
            this.setState({active: response.data});
        }
    }

    componentDidMount() {
        api.post('/chat/join',null, {params: {lobbytoken: "hihi", userToken:localStorage.userToken}})
        this.scrollchat();
        this.timerID = setInterval(() => {
            this.fetchUser();
            this.updateStatus();
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
        const rows = [];
        for (const msg in this.state.messages) {
            rows.push(<Message username={msg.username} message={msg.message}/>)
        }
        return rows;
    }

}
