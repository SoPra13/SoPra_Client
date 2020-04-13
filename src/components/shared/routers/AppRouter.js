import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import UnityGame from "../../game/UnityGame";
import { DashboardGuard } from "../routeProtectors/DashboardGuard";
import DashboardRouter from "./DashboardRouter";
import EditProfile from "../../profile/EditProfile";
import {CustomLobbyGuard} from "../routeProtectors/CustomLobbyGuard";
import CustomLobby from "../../lobby/CustomLobby";
import Profile from "../../profile/Profile";
import {RegisterGuard} from "../routeProtectors/RegisterGuard";
import Register from "../../register/Register";
import WaitingLobby from "../../lobby/WaitingLobby";

/**
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>

            <Route
              path="/dashboard"
              render={() => (
                <DashboardGuard>
                  <DashboardRouter base={"/dashboard"} />
                </DashboardGuard>
              )}
            />

            <Route
              path="/login"
              exact
              render={() => (
                <LoginGuard>
                  <Login />
                </LoginGuard>
              )}
            />

              <Route
                  path="/dashboard/profile/editprofile"
                  exact
                  render={() => (
                      <EditProfile/>
                  )}
              />

              <Route
                  path="/dashboard/lobby/waitingLobby"
                  exact
                  render={() => (
                      <WaitingLobby/>
                  )}
              />

              <Route
                  path="/register"
                  exact
                  render={() => (
                      <RegisterGuard>
                          <Register />
                      </RegisterGuard>
                  )}
              />

              <Route
                  path="/dashboard/customLobby"
                  exact
                  render={() => (
                      <CustomLobbyGuard>
                          <CustomLobby/>
                      </CustomLobbyGuard>
                  )}
              />

              <Route
                  path="/dashboard/profile"
                  exact
                  render={() => (
                      <Profile/>
                  )}
              />

              <Route
                  path="/unityTesting"
                  exact
                  render={() => (
                          <UnityGame />
                  )}
              />
              <Route path="/" exact render={() => <Redirect to={"/dashboard"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}


export default AppRouter;
