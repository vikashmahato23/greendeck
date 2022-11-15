import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../actions/userActions";
import "./Sub.css";
import axios from "axios";
import Select from "react-select";
import { set } from "mongoose";
import Table from "../components/Table";
const Subscription = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  console.log(userInfo, "usrifo");
  const data = useSelector((state) => state.userDetails.user);
  const [res, setRes] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  // const[token,setToken]=({})
  const[show,setShow]=useState(false)
  const [options,setOption]=useState([])
// const options = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];

const customStyles = {
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "green",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  control: (provided, state) => ({
    ...provided,
    background: "#f7f7f7",
    "&,&:focus,&:active": {
      borderWidth: "3px",
    },
    boxShadoow: "none",
    outline: "none",
    borderColor: state.isFocused ? "green" : "transparent",
    borderRadius: "8px",
    padding: "12px 16px",
    "&:hover": {
      borderColor: "transparent",
    },
  }),
};

  useEffect(() => {
    if (location.state) {
      var code = location.state.split("=")[1].split("&")[0];
      axios
        .post("http://localhost:5000/getToken", { code })
        .then((res) => {
          console.log(res.data, "token");
         
          axios
            .post("http://localhost:5000/getUserInfo", { token: res.data })
            .then((data) => {
              axios
                .post("http://localhost:5000/readDrive", { token: res.data })
                .then((spread) => {
                  dispatch(
                    updateUser({
                      id: userInfo._id,
                      user: {
                        email: data.data.email,
                        name: data.data.name,
                        googleId: data.data.id,
                        spreadsheet: spread.data,
                      },
                    })
                  );
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });

          //  setRes(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location.state]);
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "389276360501-l0hjjo1o29eui8ohijl065vj1gd0bkv9.apps.googleusercontent.com",
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const responseGoogle = (response) => {
    axios
      .get("http://localhost:5000/getAuthURL")
      .then((res) => {
        console.log(res.data);
        setRes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
   function handlesubcriber(data){
   setOption([...data])
   }
  function googleLogin() {}
  return (
    <div>
      <div>
        {/* <select name="" id="" onChange={(e)=>{
          console.log(e)
        }}>
          <option>Subscriber</option>
         { userInfo.subscription?.map((e, i) => {
                return (
                  <option
                 
                    onClick={() => {
                      console.log("click");
                    }}
                  >
                    {e.googleId}
                  </option>
                )
         })} */}
        {/* subscriber */}
        <div className="container">
          <h1 className="title">Subscriber</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
             <tbody>
              {(() => {
                if (userInfo.subscription && data.subscription) {
                  return data.subscription?.map((e, i) => {
                    return (
                      <Table key={i} employdata={e} onClick={handlesubcriber} />
                    );
                  });
                } else if (userInfo.subscription) {
                  return userInfo.subscription?.map((e, i) => {
                    return (
                      <Table key={i} employdata={e} onClick={handlesubcriber} />
                    );
                  });
                } else if (data.subscription) {
                  return data.subscription?.map((e, i) => {
                    return (
                      <Table key={i} employdata={e} onClick={handlesubcriber} />
                    );
                  });
                } else {
                  return null;
                }
              })()}
             </tbody>
          </table>
        </div>
        {/* </select> */}

        {/* <Table/> */}
      </div>
      <div>
        {/* <GoogleLogin
          clientId="389276360501-l0hjjo1o29eui8ohijl065vj1gd0bkv9.apps.googleusercontent.com"
          buttonText="Add a Subscription"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        /> */}
        <button onClick={responseGoogle}>Add a subscirption</button>
        <div style={{ marginTop: "10px", marginBottom: "5px" }}>
          {res ? (
            <button onClick={googleLogin}>
              <a href={res}>Verify by google</a>
            </button>
          ) : null}
        </div>

        <div className="select">
          <h2>Shee name</h2>
          <Select
            styles={customStyles}
            className="select"
            options={options}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#f7f7f7",
                primary: "green",
                primary50: "green",
              },
            })}
          />
          <h2>Tab name</h2>
          <Select
          onChange={(e)=>{
            console.log()
          }}
            styles={customStyles}
            className="select"
            options={options}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#f7f7f7",
                primary: "green",
                primary50: "green",
              },
             
            })}

          
          />
        </div>
      </div>
    </div>
  );
};

export default Subscription;
