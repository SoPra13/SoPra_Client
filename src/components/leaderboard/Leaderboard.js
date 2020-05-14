import React, { Component } from 'react'
import PlayerBox from './PlayerBox'
import './leaderboard.css'
import LeaderboardSelector from './leaderboardselector'
import { api } from '../../helpers/api'


export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {lead: [], selected: "TOTALSCORE"}
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (
            <div className="leaderboardoutercontainer">
                <h1>Leaderboard</h1>
                <LeaderboardSelector selected={this.state.selected} handlechange={this.handleChange}/>
                <div className="leaderboardinnercontainer">
                {this.state.lead.map(l => (<PlayerBox rank={l.rank + "."} username={l.username} score={l.result}/>))}
                </div>
            </div>
        )
    }

    async componentDidMount() {
        this.fetchLeaderboard(this.state.selected);
    }

    handleChange(event) {
        this.setState({selected: event.target.value})
        this.fetchLeaderboard(event.target.value);
    }

    async fetchLeaderboard(selected) {
        try {
            const response = await api.get('/leaderboard', {params: {by: selected}});
            this.setState({lead: response.data}); 
        } catch (error) {
            alert(error)
        }
    }
}
