import React, { useState, useEffect } from "react";
import styled from "styled-components";
import claData from "../data/claData.json";
import { useGlobalState } from "./globalState";
import { useNavigate } from "react-router";
import { AWS_ENDPOINT } from "../config";
import Navbar from "./navbar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
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


const CourseList = styled.div`
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;

  & > div {
    background-color: #f0f0f0;
    padding: 10px;
    margin: 5px;
    border-radius: 4px;
    display: flex;
    align-items: center;

    & > button {
      margin-left: 10px;
    }
  }
`;



const Search = () => {
  const navigate = useNavigate();
  const [globalState, setGlobalState] = useGlobalState();
  const [searchCourses, setSearchCourses] = useState(claData["claData"]);
  const [searchTerm, setSearchTerm] = useState("");


  const checkAuthentication = async () => {
    if (!globalState.isAuthenticated) {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1];

      if (cookieValue) {
        try {
          const response = await fetch(
            `${AWS_ENDPOINT}/fetch-user?user_id=${cookieValue}`
          );
          const data = await response.json();

          if (response.ok) {
            setGlobalState("user", data.user);
            setGlobalState("isAuthenticated", true);
            if (!data.user.completed_consent) {
              navigate("/consent-form");
            }
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    }
  };


  const search = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const courses = claData["claData"].filter(course =>
      course["course_title"].toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchCourses(courses);
    
  };


  useEffect(() => {
    checkAuthentication();
  }, [globalState]);

  return (
    <div>
      <Navbar />

      <Container>

        <div>
          <Title>Search</Title>

          <Input type="text" value={searchTerm} onChange={search}></Input>

          <CourseList>
          {searchCourses.map(course => (
            <div key={course.course_title}>
              <h3>{course.course_title}</h3>
            </div>
          ))}
        </CourseList>

        </div>
      </Container>
    </div>
  );
};

export default Search;
