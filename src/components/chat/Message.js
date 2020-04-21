import React from 'react'
import '../../components/chat/chat.css'

export function Message(props) {

    return (
        <div>
            <span className="usernametext">{props.username}:</span> <span className="messagetext">{props.message}</span></div>
    )
}
