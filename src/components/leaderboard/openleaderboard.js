import React, { Component } from 'react'
import './leaderboard.css'
import Leaderboard from './Leaderboard'
import { Button } from '../../views/design/Button'
import { withRouter } from 'react-router-dom';


class Openleaderboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="openleaderboard">
                <div className="openleaderboardinner">
                <Leaderboard/>
                <Button
                    width="100%" margin-top="10em"
                        onClick={() => {
                            this.props.history.push('/login');
                            }}
                                    >
                        Back
                </Button>
                </div>
            </div>
        )
    }
}

export default withRouter(Openleaderboard);