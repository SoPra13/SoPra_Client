import React from 'react'
import "./leaderboard.css"

export default function PlayerBox(props) {
    return (
        <div className="playerBox">
            <p className="rank ">{props.rank}</p><p className="username">{props.username}</p><p className="score">{props.score}</p>
        </div>
    )
}

