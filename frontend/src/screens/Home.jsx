import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';

const Home = () => {
    const navigate=useNavigate()
    const location=useLocation()
       
            const userLogin = useSelector((state) => state.userLogin);
            const { loading, error, userInfo } = userLogin;
            console.log(userInfo,"home")
            const dispatch=useDispatch()
    useEffect(()=>{
     if(location.path!="/"){
      console.log(location.search,"seach")
      let newObject = window.localStorage.getItem("set");
      var obj=JSON.parse(newObject);
     dispatch({
       type: USER_LOGIN_SUCCESS,
       payload: obj,
     })
      navigate("/subscription",{
        state:location.search
      })
     }
    },[location])
    return (
      <div>
    
        dfdfdfdfdsfd
      </div>
    );
};

export default Home;