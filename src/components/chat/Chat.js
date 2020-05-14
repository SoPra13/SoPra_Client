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
                <div className={"form " + (localStorage.theme === "dark"?"dark":"light")}>
                    <div className="chatbox" ref={(el) => {this.chat = el;}}>
                        {this.state.messages.map(msg => (<Message messageType={msg.messageType} username={msg.username} message={msg.message}/>))}
                        {!this.state.active?<p style={{color:"red"}}>Chat closed!</p>:<div style={{ float:"left", clear: "both" }}/>}
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
            const json = JSON.stringify({message: this.state.msginput})
            api.post("/chat", json, {params: {userToken: localStorage.userToken, lobbyToken: localStorage.lobbyToken}});
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
        const response = await api.get('/chat/active', {params: {lobbyToken: localStorage.lobbyToken}});
        if (this.state.active !== response.data) {
            this.setState({active: response.data});
        }
    }

    componentDidMount() {
        api.post('/chat/join',null, {params: {lobbyToken: localStorage.lobbyToken, userToken:localStorage.userToken}})
        this.scrollchat();
        this.timerID = setInterval(() => {
            this.fetchUser();
            this.updateStatus();
        }, 200);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    componentDidUpdate() {
        this.scrollchat()
    }

    scrollchat() {
        this.chat.scrollTop = this.chat.scrollHeight;
    }

    async fetchUser() {
        try {
            const response = await api.get('/chat', {params: {lobbyToken: localStorage.lobbyToken}});
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
