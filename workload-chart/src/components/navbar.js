import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { useGlobalState } from "./globalState";
import { useNavigate } from "react-router";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 20px;
  background-color: #f0f0f0;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
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

const Spacer = styled.div`
  flex: 1 1 auto;
`;

const StyledLink = styled(Link)`
  padding: 10px;
  text-decoration: none;
  color: white;
  border-radius: 4px;
  background-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [globalState, setGlobalState] = useGlobalState();

  const handleLogout = () => {
      document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setGlobalState("user", null);
      setGlobalState("isAuthenticated", false);
      navigate("/login");
      };

  return (
    <Container>
      <StyledLink to="/">CLA</StyledLink>
      <StyledLink to="/search">Search</StyledLink>

      <Spacer></Spacer>

      <Button className="button" onClick={handleLogout}>
        Logout
      </Button>
    </Container>

  );
};

export default Navbar;
