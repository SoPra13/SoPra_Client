import React from 'react'

export function Message(props) {
    return (
        <p>{props.username}: {props.message}</p>
    )
}
