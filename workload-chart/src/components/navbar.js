import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import styled from "styled-components";
import { useGlobalState } from "./globalState";
import { AWS_ENDPOINT } from "../config";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 20px;
  background-color: #f0f0f0;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled.div`
  padding: 10px;
  text-decoration: none;
  color: ${({ active }) => (active ? '#0056b3' : '#007bff')};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  
  &:hover {
    color: #0056b3;
    opacity: 0.8;
  }
`;

const Spacer = styled.div`
  flex: 1 1 auto;
`;

const Button = styled.button`
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location
  const [globalState, setGlobalState] = useGlobalState();
  const [activeLink, setActiveLink] = useState(location.pathname); // Set the initial active link to the current path

  useEffect(() => {
    // Update the active link when the route changes
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setGlobalState("user", null);
    setGlobalState("isAuthenticated", false);
    navigate("/login");
  };

  const handleNav = (path) => {
    const logObject = {
      user_id: globalState.user.user_id,
      session_id: globalState.session_id,
      action: "navigate",
      value: path,
    }

    axios
    .post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
    .then((response) => {
      console.log(response);
      navigate(path);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  }

  return (
    <Container>
      <NavLink active={activeLink === "/"} onClick={() => handleNav("/")}>Workload Preview</NavLink>
      <NavLink active={activeLink === "/search"} onClick={() => handleNav("/search")}>Semester Planning</NavLink>
      <NavLink active={activeLink === "/tutorial"} onClick={() => handleNav("/tutorial")}>FAQ and Resources</NavLink>
      <Spacer />
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Navbar;
