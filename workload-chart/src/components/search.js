import React, { useState, useEffect } from "react";
import styled from "styled-components";
import levenshtein from "fast-levenshtein";
import Highlighter from "react-highlight-words";
import ReactPaginate from 'react-paginate';
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
  width: 90rem;

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

const Course = styled.div`
  display: block !important;
  width: 100%;

  & > p {
    line-height: 30px;
  }
`;

const StyledPaginate = styled(ReactPaginate).attrs({ activeClassName: 'active' })`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style-type: none;
  padding: 0 5rem;

  li a {
    border-radius: 3px;
    padding: 0.1rem 1rem;
    border: gray 1px solid;
    cursor: pointer;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #0366d6;
    border-color: transparent;
    color: white;
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

const Search = () => {
  const coursesPerPage = 5;

  const navigate = useNavigate();
  const [globalState, setGlobalState] = useGlobalState();
  const [searchCourses, setSearchCourses] = useState(claData["claData"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseOffset, setCourseOffset] = useState(0);

  const endOffset = courseOffset + coursesPerPage;
  const currentSearchCourses = searchCourses.slice(courseOffset, endOffset);
  const pageCount = Math.ceil(searchCourses.length / coursesPerPage);


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

    const courses = claData["claData"]
      .map(course => [
        course, 
        Math.min(...course["course_title"] // get the ranking which is the min distance between the individual words in the course title and the search term
          .toLowerCase() // lowercase the title
          .split(" ") // split title to multiple words
          .map(word => levenshtein.get(word, searchTerm.toLowerCase())) // get character distance between the individual words and the search term
        )
      ])
      .sort((a, b) => a[1] - b[1]) // sort the courses by the ranking
      .map(a => a[0]); // remove the ranking

    setSearchCourses(courses);
    setCourseOffset(0);
    
  };


  useEffect(() => {
    checkAuthentication();
  }, [globalState]);


  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * coursesPerPage) % searchCourses.length;
    setCourseOffset(newOffset);
  };

  return (
    <div>
      <Navbar />

      <Container>

        <div>
          <Title>Search</Title>

          <Input type="text" value={searchTerm} onChange={search}></Input>

          <CourseList>
          {currentSearchCourses.map(course => (
            <Course key={course.course_title}>
              <h3>
                <Highlighter 
                  highlightClassName="highlighter"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={course.course_title}
                />
              </h3>
              <p>Time Load: {course.total.tl}</p>
              <p>Mental Effort: {course.total.me}</p>
              <p>Psychological Stress: {course.total.ps}</p>
              <p>Credit Hours: {course.total.ch}</p>
            </Course>
          ))}
        </CourseList>
        <StyledPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />

        </div>
      </Container>
    </div>
  );
};

export default Search;
