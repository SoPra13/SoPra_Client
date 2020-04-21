import React from 'react'
import styled from 'styled-components'


const Usernametext = styled.span`

`
const Messagetext = styled.span`

`
export function Message(props) {

    return (
        <div><Usernametext>{props.username}:</Usernametext> <Messagetext>{props.message}</Messagetext></div>
    )
}
