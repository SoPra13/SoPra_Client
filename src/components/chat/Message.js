import React from 'react'
import '../../components/chat/chat.css'

export function Message(props) {

    return (
    <div>
        {
            props.username!=="EVENTEVENTEVENT"
            ?
            (<><span className="usernametext">{props.username}:</span> <span className="messagetext">{props.message}</span></>)
            :
            (<p style={{color: "blue"}}>{props.message}</p>)
        }
    </div>
    )
}
