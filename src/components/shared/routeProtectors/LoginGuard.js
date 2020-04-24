import React from "react";
import { Redirect } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
export const LoginGuard = props => {
  if(localStorage.getItem("gameToken")){
    return <Redirect to={"/unityGame"} />;
} else if (localStorage.getItem("lobbyToken")) {
    return <Redirect to={"/dashboard/waitingLobby"} />;
} else if(localStorage.getItem("userToken")) {
  return <Redirect to={"/dashboard"} />; 
} else {
  return props.children; 

}
};
