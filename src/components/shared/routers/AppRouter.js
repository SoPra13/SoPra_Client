import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import UnityGame from "../../game/UnityGame";
import { DashboardGuard } from "../routeProtectors/DashboardGuard";
import DashboardRouter from "./DashboardRouter";
import EditProfile from "../../profile/EditProfile";
import {CustomLobbyGuard} from "../routeProtectors/CustomLobbyGuard";
import CustomLobby from "../../lobby/CustomLobby";
import {RegisterGuard} from "../routeProtectors/RegisterGuard";
import Register from "../../register/Register";
import WaitingLobby from "../../lobby/WaitingLobby";
import {GameGuard} from "../routeProtectors/GameGuard";
import {LobbyGuard} from "../routeProtectors/LobbyGuard";
import LoginLobby from "../../lobby/LoginLobby";
import Chat from "../../chat/Chat";
import Leaderboard from "../../leaderboard/Leaderboard";


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
              exact
              render={() => (
                <DashboardGuard>
                  <DashboardRouter base={"/dashboard"} />
                </DashboardGuard>
              )}
            />

            <Route
              path='/login'
              exact
              render={() => (
                <LoginGuard>
                  <Login/>
                </LoginGuard>
              )}
            />

              <Route
                  path="/dashboard/profile/editprofile"
                  exact
                  render={() => (
                    <DashboardGuard>
                      <EditProfile/>
                    </DashboardGuard>
                  )}
              />

              <Route
                  path="/register"
                  exact
                  render={() => (
                      <RegisterGuard>
                          <Register/>
                      </RegisterGuard>
                  )}
              />

              <Route
                  path="/dashboard/customLobby"
                  exact
                  render={() => (
                      <DashboardGuard>
                          <CustomLobby/>
                      </DashboardGuard>
                  )}
              />

              <Route
                  path="/dashboard/loginLobby"
                  exact
                  render={() => (
                    <DashboardGuard>
                      <LoginLobby/>
                      </DashboardGuard>
                  )}
              />

              <Route
                  path="/dashboard/waitingLobby"
                  exact
                  render={() => (
                    <LobbyGuard>
                      <WaitingLobby/>
                    </LobbyGuard>
                  )}
              />


              <Route
                  path="/unityGame"
                  exact
                  render={() => (
                      <GameGuard>
                          <UnityGame />
                        </GameGuard>
                  )}
              />

                <Route
                  path="/chat"
                  exact
                  render={() => (
                      <Chat />
                  )}
              />

              <Route path="/leaderboard" exact render={() => <Leaderboard/>}/>
              <Route path="/" exact render={() => <Redirect to={"/login"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}


export default AppRouter;
