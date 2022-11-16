import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_LOGIN_SUCCESS } from "../constants/userConstants";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  console.log(userInfo, "home");
  const dispatch = useDispatch();
  useEffect(() => {
    if (location.pathname == "/" && location.search) {
      console.log(location.search, "seach");
      let newObject = window.localStorage.getItem("set");
      var obj = JSON.parse(newObject);
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: obj,
      });
      navigate("/subscriptions", {
        state: location.search,
      });
    }
  }, [location]);
  return (
    <div>
      <h3>WELCOME TO Google Drive To Google SHEETS</h3>
      <img
        src="https://www.cmscritic.com/wp-content/themes/cmscritic/img/cloudinary/google-sheets-landing_pages_mci9xr.jpg"
        alt=""
      />
    </div>
  );
};

export default Home;
