import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Dashboard from "../../dashboard/Dashboard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class DashboardRouter extends React.Component {
    render() {
        /**
         * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
         */
        return (
            <Container>
                <Route
                    exact
                    path={`${this.props.base}/dashboard`}
                    render={() => <Dashboard />}
                />

                <Route
                    exact
                    path={`${this.props.base}`}
                    render={() => <Redirect to={`${this.props.base}/dashboard`} />}
                />
            </Container>
        );
    }
}

export default DashboardRouter;
