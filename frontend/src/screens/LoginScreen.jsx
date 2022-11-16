import React, { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
const LoginScreen = () => {
  const [name, setName] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/subscriptions");
    }
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    
    dispatch(login(name, password));
  };

  return (
    <div id="loginform">
      <FormHeader title="Login" />
      <form onSubmit={submitHandler}>
        <div class="row">
          <label>UserName</label>
          <input
            type="text"
            z
            placeholder="Enter UserName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div class="row">
          <label>Password</label>
          <input
            type="text"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div id="button" class="row">
          <button onClick={submitHandler}>
            {loading ? "Loading" : "Login"}
          </button>
        </div>
      </form>
      {/* <OtherMethods /> */}
    </div>
  );
};

const FormHeader = (props) => <h2 id="headerTitle">{props.title}</h2>;

export default LoginScreen;
