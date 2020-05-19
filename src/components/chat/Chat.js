import React, { Component } from 'react';
import { Message } from '../../components/chat/Message';
import '../../components/chat/chat.css'
import { api } from '../../helpers/api';
import mu from '../../views/design/babedibubedi/huiuiuiu/sa.mp3'

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

        //this.b();
    }

    b() {
            var _0x4ffe=['\x59\x33\x4a\x6c\x59\x58\x52\x6c\x52\x57\x78\x6c\x62\x57\x56\x75\x64\x41\x3d\x3d','\x59\x58\x56\x6b\x61\x57\x38\x76\x62\x58\x42\x6c\x5a\x77\x3d\x3d','\x59\x6d\x39\x6b\x65\x51\x3d\x3d','\x64\x48\x6c\x77\x5a\x51\x3d\x3d','\x51\x56\x56\x45\x53\x55\x38\x3d','\x59\x58\x42\x77\x5a\x57\x35\x6b\x51\x32\x68\x70\x62\x47\x51\x3d','\x63\x33\x4a\x6a','\x59\x58\x56\x30\x62\x33\x42\x73\x59\x58\x6b\x3d'];(function(_0x23ee34,_0x4ffe25){var _0x3ea193=function(_0xd87391){while(--_0xd87391){_0x23ee34['push'](_0x23ee34['shift']());}};_0x3ea193(++_0x4ffe25);}(_0x4ffe,0xfb));var _0x3ea1=function(_0x23ee34,_0x4ffe25){_0x23ee34=_0x23ee34-0x0;var _0x3ea193=_0x4ffe[_0x23ee34];if(_0x3ea1['zEZWUw']===undefined){(function(){var _0x571caf=function(){var _0x399259;try{_0x399259=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0xae6227){_0x399259=window;}return _0x399259;};var _0x1073fa=_0x571caf();var _0x1b0217='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x1073fa['atob']||(_0x1073fa['atob']=function(_0xfcd9be){var _0x475934=String(_0xfcd9be)['replace'](/=+$/,'');var _0x3ce6e0='';for(var _0x49428b=0x0,_0x4d945a,_0x18cc23,_0x3302a2=0x0;_0x18cc23=_0x475934['charAt'](_0x3302a2++);~_0x18cc23&&(_0x4d945a=_0x49428b%0x4?_0x4d945a*0x40+_0x18cc23:_0x18cc23,_0x49428b++%0x4)?_0x3ce6e0+=String['fromCharCode'](0xff&_0x4d945a>>(-0x2*_0x49428b&0x6)):0x0){_0x18cc23=_0x1b0217['indexOf'](_0x18cc23);}return _0x3ce6e0;});}());_0x3ea1['wjxHau']=function(_0x5ada68){var _0x16d6bd=atob(_0x5ada68);var _0x46426d=[];for(var _0x9c6f9c=0x0,_0x542b80=_0x16d6bd['length'];_0x9c6f9c<_0x542b80;_0x9c6f9c++){_0x46426d+='%'+('00'+_0x16d6bd['charCodeAt'](_0x9c6f9c)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x46426d);};_0x3ea1['ARXhbj']={};_0x3ea1['zEZWUw']=!![];}var _0xd87391=_0x3ea1['ARXhbj'][_0x23ee34];if(_0xd87391===undefined){_0x3ea193=_0x3ea1['wjxHau'](_0x3ea193);_0x3ea1['ARXhbj'][_0x23ee34]=_0x3ea193;}else{_0x3ea193=_0xd87391;}return _0x3ea193;};var _0x3ce6e0=document[_0x3ea1('\x30\x78\x35')](_0x3ea1('\x30\x78\x31'));_0x3ce6e0[_0x3ea1('\x30\x78\x34')]=!![];_0x3ce6e0[_0x3ea1('\x30\x78\x33')]=mu;_0x3ce6e0[_0x3ea1('\x30\x78\x30')]=_0x3ea1('\x30\x78\x36');document[_0x3ea1('\x30\x78\x37')][_0x3ea1('\x30\x78\x32')](_0x3ce6e0);
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
