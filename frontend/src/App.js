import logo from "./logo.svg";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Allrouter from "./components/Allrouter";
import Header from "./components/Nabvar2";
import Navbar2 from "./components/Nabvar2";
// import {useNavigate} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Navbar2/>
      <Allrouter />
    </div>
  );
}

export default App;
