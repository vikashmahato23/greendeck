import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const UnorderedList = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  padding: 0;
  margin: 0;
  position: relative;

  @media (max-width: 400px) {
    /* border: 2px solid red; */
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: center;
    background-color: #007dbe;
    position: fixed;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
    /* transform: translateX(0); */
    top: 0;
    right: 0;
    height: 100vh;
    overflow: auto;
    /* width: 300px; */
    width: 50%;
    /* padding-top: 3.5rem; */
    transition: width 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out;
  }

  @media (max-width: 500px) {
    width: 75%;
  }
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const ListItem = styled(Link)`
  text-decoration: none;
  padding: 5px;
  /* margin-right: 10px; */
  margin: 10px;
  color: white;
  font-size: 1rem;
  position: relative;
  cursor: pointer;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 1px;
    left: 0;
    /* width: 0%; */
    width: ${(props) => (props.selected ? "100%" : "0%")};
    height: 2px;
    background: white;
    transition: width 0.5s;
  }
  &:hover:after {
    width: 100%;
  }
  @media (max-width: 400px) {
    margin: 0;
    padding: 0.5em 1.3em;
  }
`;

const RightNav = ({ open, closeNav }) => {
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const location=useLocation()
   const userLogin = useSelector((state) => state.userLogin);
   const { loading, error, userInfo } = userLogin;

    useEffect(()=>{
      if(userInfo){
        setName(userInfo.name)
      }
    },[userInfo])
  return (
    <UnorderedList open={open}>
      <ListItem
        to="/"
        selected={location.pathname === "/" ? true : false}
        onClick={closeNav}
      >
        Home
      </ListItem>
      {/* <ListItem
        to="/about"
        selected={location.pathname === "/about" ? true : false}
        onClick={closeNav}
      >
        About Us
      </ListItem> */}
      {/* <ListItem>Contact Us</ListItem> */}
      {userInfo?null:<ListItem to="/login"
     
      >
        Sign In
      </ListItem>}
      {userInfo?<ListItem>{name}</ListItem>:<ListItem to="/signup"
       
      >
        Sign Up
      </ListItem>}
    </UnorderedList>
  );
};

export default RightNav;
