import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./Nabvar2";
import { Container } from "react-bootstrap";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import Subscription from "../screens/Subscription";
import Home from "../screens/Home";
import { useSelector } from "react-redux";
import Dashboard from "../screens/Dashboard";
const Allrouter = () => {
     const userLogin = useSelector((state) => state.userLogin);
     const { loading, error, userInfo } = userLogin;
     const {path}=useLocation()
       console.log(path)
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        {userInfo ? (
          <Route path="/subscriptions" element={<Subscription />} />
        ) : null}
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  );
};

export default Allrouter;
