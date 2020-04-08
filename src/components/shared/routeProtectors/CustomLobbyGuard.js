import React from "react";
import { Redirect } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
export const CustomLobbyGuard = props => {
    if (!localStorage.getItem("token")) {
        return props.children;
    }


    return <Redirect to={"/customLobby"} />;
};
