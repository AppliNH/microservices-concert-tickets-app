import { useState } from "react";
import useRequest from '../../hooks/use-request';
import Router from "next/router";
import SignPage from "../../components/sign-page";


const signup = () => {

    return(
        <SignPage text={"Sign Up"} routeAPI={"signup"} />
    );
}

export default signup;