import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styled from "styled-components";
import claData from "../data/claData.json";
import semesterData from "../data/semesterData.json";
import CustomLegend from "../CustomLegend"; // Import custom legend
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

const ToggleButton = styled(Button)`
  background-color: ${(props) => (props.active ? "#28a745" : "#007bff")};

  &:hover {
    background-color: ${(props) => (props.active ? "#218838" : "#0056b3")};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
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

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Graph = () => {
  const [courseBasket, setCourseBasket] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [globalState, setGlobalState] = useGlobalState();
  const [showSum, setShowSum] = useState(true);
  const [showTL, setShowTL] = useState(true);
  const [showME, setShowME] = useState(true);
  const [showPS, setShowPS] = useState(true);
  const [htmlContent, setHtmlContent] = useState(""); // State to hold fetched HTML

  const itemsPerPage = 5;

  const handleAddCourse = (course) => {
    if (!courseBasket.includes(course)) {
      setCourseBasket([...courseBasket, course]);
    }
  };

  const handleRemoveCourse = (course) => {
    setCourseBasket(courseBasket.filter((c) => c !== course));
  };

  const fetchBuckets = async () => {
    if (globalState?.user?.user_id) {
      try {
        const response = await fetch("/fetch-buckets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: globalState.user.user_id }),
        });

        if (response.ok) {
          const data = await response.text(); // Fetch HTML as plain text
          setHtmlContent(data); // Store the HTML content
          console.log("Fetched buckets successfully");
        } else {
          console.error("Failed to fetch buckets");
        }
      } catch (error) {
        console.error("Error occurred during fetchBuckets", error);
      }
    } else {
      console.log("globalState.user.user_id not available");
    }
  };

  const filteredCourses = claData.claData.filter((course) =>
    course.course_title.toLowerCase().includes("")
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

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
    } else {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCourses, totalPages, currentPage, globalState]);

  return (
    <div>
      <Navbar />
      <Container>
        {globalState.user && (
          <Title>
            Hi {globalState.user.name}, here's your Weekly Workload Chart
          </Title>
        )}
        <Button onClick={fetchBuckets}>Fetch Buckets</Button>

        {/* Render HTML content */}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>

        <CourseList>
          {paginatedCourses.map((course) => (
            <div key={course.course_title}>
              {course.course_title}
              <Button onClick={() => handleAddCourse(course)}>Add</Button>
            </div>
          ))}
        </CourseList>
      </Container>
    </div>
  );
};

export default Graph;
