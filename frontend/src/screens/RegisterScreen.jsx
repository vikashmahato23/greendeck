import React, { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
const RegisterScreen = () => {
        const [name, setName] = useState("");

        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [message, setMessage] = useState(null);
        const navigate=useNavigate()

        const dispatch = useDispatch();

        const userRegister = useSelector((state) => state.userRegister);
        const { loading, error, userInfo } = userRegister;
     
      
        useEffect(() => {
          if (userInfo) {
          navigate("/subscription");
          }
        }, [userInfo]);

        const submitHandler = (e) => {
          e.preventDefault();
      
            dispatch(register(name, password));
          
        };

  return (
    <div id="loginform">
      <FormHeader title="Signup" />
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
          <button onClick={submitHandler}>{loading?"Loading":"Signup"}</button>
        </div>
      </form>
      {/* <OtherMethods /> */}
    </div>
  );
};

const FormHeader = (props) => <h2 id="headerTitle">{props.title}</h2>;





export default RegisterScreen;
