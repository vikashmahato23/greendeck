import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../actions/userActions";

const Subscription = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const data = useSelector((state) => state.userDetails.user);


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
    console.log(response,"response")
    setName(response.profileObj.name);
    setEmail(response.profileObj.email);
    setUrl(response.profileObj.imageUrl);
    setLoginStatus(true);
    dispatch(
      updateUser({
        id: userInfo._id,
        user: {
          email: response.profileObj.email,
          name: response.profileObj.name,
          googleId: response.profileObj.googleId,
        },
      })
    );
  };
  return (
    <div>
      <div>
        <select name="" id="">
          <option>Subscriber</option>
          {/* subscriber */}
          {(() => {
            if (userInfo.subscription && data.subscription) {
             
              return data.subscription?.map((e, i) => {
                return <option key={i}>{e.email}</option>;
              });
            } else if (userInfo.subscription) {
         
              return userInfo.subscription?.map((e, i) => {
                return <option key={i}>{e.email}</option>;
              });
            }
            else if(data.subscription){
                return data.subscription?.map((e, i) => {
                  return <option key={i}>{e.email}</option>;
                });
            }
             else {
              return null;
            }
          })()}
        </select>
      </div>
      <div>
        <GoogleLogin
          clientId="389276360501-l0hjjo1o29eui8ohijl065vj1gd0bkv9.apps.googleusercontent.com"
          buttonText="Add a Subscription"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </div>
  );
};

export default Subscription;
