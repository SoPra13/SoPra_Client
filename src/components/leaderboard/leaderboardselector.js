import React from 'react'
import "./leaderboard.css"

export default function LeaderboardSelector(props) {
    return (
        <div class="select-wrapper"> 
            <select class="scoreSelect" value={props.selected} onChange={props.handlechange}>
                <option value="TOTALSCORE">Total Score</option>
                <option value="DUPLICATECLUES">Duplicate clues</option>
                <option value="TOTALCLUES">Total clues</option>
                <option value="INVALIDCLUES">Invalid clues</option>
                <option value="GUESSESCORRECT">Guesses correct</option>
                <option value="GUESSESMADE">Guesses made</option>
                <option value="GAMESPLAYED">Games played</option>
            </select>
        </div>
    )
}
