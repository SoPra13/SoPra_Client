import React, { Component } from "react";
import AppRouter from "./components/shared/routers/AppRouter";
import { api } from "./helpers/api";
import LoginCSS from "./components/login/login.css";

class App extends Component {
  componentDidMount() {
    api.get("/user", {params: { token:localStorage.userToken}}).catch(() => {localStorage.removeItem("userToken")})
    api.get("/lobby", {params: { lobbyToken:localStorage.lobbyToken}}).catch(() => {localStorage.removeItem("lobbyToken")})
    api.get("/game", {params: { token:localStorage.userToken}}).catch(() => {localStorage.removeItem("gameToken")})
  }
  render() {
    return (
      <div>
{/*        <Header height={"80"} />*/}
        <AppRouter />
      </div>
    );
  }
}


export default App;
