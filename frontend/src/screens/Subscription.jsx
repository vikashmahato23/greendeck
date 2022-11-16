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
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [url, setUrl] = useState("");
  // const [loginStatus, setLoginStatus] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const data = useSelector((state) => state.userDetails.user);
  const [res, setRes] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = "";
  const [show, setShow] = useState(false);
  const [options, setOption] = useState([]);
  const [tab, setTAb] = useState([]);

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
  //process of getting google Id and sbuscripton
  useEffect(() => {
    if (location.state) {
      var code = location.state.split("=")[1].split("&")[0];
      axios
        .post("http://localhost:5000/getToken", { code })
        .then((res) => {
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
                        token: res.data,
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
  //set Sheetname
  function handlesubcriber(data) {
    setOption([...data]);
    setShow(true);
  }
  //onchange gettin sheettab function

  function googleLogin() {}
  return (
    <div>
      <div>
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
        <button style={{ width: "20%" }} onClick={responseGoogle}>
          Add a subscirption
        </button>
        <div style={{ marginTop: "10px", marginBottom: "5px" }}>
          {res ? (
            <button style={{ width: "20%" }} onClick={googleLogin}>
              <a href={res}>Verify by google</a>
            </button>
          ) : null}
        </div>

        {show ? (
          <div className="select">
            <h2>Sheet name</h2>
            <Select
              //get all sheet of spred sheet id by changing sheet
              onChange={(e) => {
                console.log(e.value, "vlue", userInfo, "dfd", options);
                axios
                  .post("http://localhost:5000/sheet", {
                    token: e.access_token,
                    spreadsheetId: e.value,
                  })
                  .then((res) => {
                    var arr = [];
                    console.log(res.data);
                    for (var i = 0; i < res.data?.length; i++) {
                      arr.push({
                        value: res.data[i].properties.sheetId,
                        token: e.access_token,
                        spreadsheetId: e.value,
                        label: res.data[i].properties.title,
                      });
                    }

                    setTAb([...arr]);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
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
            <h2>Tab name</h2>
            <Select
              onChange={(e) => {
                axios
                  .post("http://localhost:5000/sheetdetials", {
                    token: e.token,
                    id: e.spreadsheetId,
                    range: e.label,
                  })
                  .then((res) => {
                    if (res.data == "") alert("no Data");
                    else navigate("/dashboard", { state: res.data });
                    console.log(res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              styles={customStyles}
              className="select"
              options={tab}
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
        ) : null}
      </div>
    </div>
  );
};

export default Subscription;
