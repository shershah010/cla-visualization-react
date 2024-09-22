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
import axios from 'axios'

import FetchBucket from "./fetchBucket";   

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showSum, setShowSum] = useState(true);
  const [showTL, setShowTL] = useState(true);
  const [showME, setShowME] = useState(true);
  const [showPS, setShowPS] = useState(true);
  const itemsPerPage = 5;

  const [buckets, setBuckets] = useState({});
  const [bucketVizName, setBucketVizName] = useState("");

  const [selectedSemester, setSelectedSemester] = useState("fall24");

  const [activeCourses, setActiveCourses] = useState({});

  const processData = (courses) => {
    const weeks = semesterData[selectedSemester].weeks;
  
    const data = weeks.map((week, index) => {
      const weekKey = `week${index + 1}`;
      const weekData = { name: week[weekKey], tl: 0, me: 0, ps: 0 };
  
      courses.forEach((course) => {
        // Only include active courses in the sum
        if (activeCourses[course.course_title]) {
          const courseWeekData = course.fall24.find((w) => w[weekKey]);
          if (courseWeekData) {
            weekData.tl += courseWeekData[weekKey].tl;
            weekData.me += courseWeekData[weekKey].me;
            weekData.ps += courseWeekData[weekKey].ps;
          }
        }
      });
  
      return weekData;
    });
  
    return data;
  };
  

  const processIndividualData = (courses) => {
    const weeks = semesterData[selectedSemester].weeks;
    const data = {};
  
    courses.forEach((course) => {
      const courseData = weeks.map((week, index) => {
        const weekKey = `week${index + 1}`;
        const weekData = { name: week[weekKey], tl: 0, me: 0, ps: 0 };
        const courseWeekData = course.fall24.find((w) => w[weekKey]);
        if (courseWeekData) {
          weekData.tl = courseWeekData[weekKey].tl;
          weekData.me = courseWeekData[weekKey].me;
          weekData.ps = courseWeekData[weekKey].ps;
        }
        return weekData;
      });
      data[course.course_title] = courseData;
    });
  
    return data;
  };

  const handleRemoveCourse = (course) => {
    setCourseBasket(courseBasket.filter((c) => c !== course));
  };

  const handleGraphToggle = (setFn, value, param) => {
    setFn(value);

    const logObject = {
      user_id: globalState.user.user_id,
      session_id: globalState.session_id,
      action: "toggle-" + param,
      value: value,
    };

    axios
      .post(`${AWS_ENDPOINT}/log`, { log_object: logObject })
      .then((response) => {
        console.log("Log response:", response);
      })
      .catch((error) => {
        console.error("Error logging:", error);
      });

  };

  const filteredCourses = claData.claData.filter((course) =>
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleSessionStart = (userStruct, sessionID) => {
    const logObject = {
        user_id: userStruct.user_id,
        session_id: sessionID,
        action: "session_start",
        value: sessionID,
    }
    
    axios.post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  }

  const checkAuthentication = async () => {
    var userStruct;
    var sessionID
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
            sessionID = Math.random().toString(36).substring(2, 15);
            userStruct = data.user;
            setGlobalState("user", userStruct);
            setGlobalState("isAuthenticated", true);
            setGlobalState("session_id", sessionID);
            handleSessionStart(userStruct, sessionID);

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
    if (!globalState.isAuthenticated) {
      checkAuthentication();
    }
  }, [filteredCourses, totalPages, currentPage, globalState]);

  const sumData = processData(courseBasket);
  const individualData = processIndividualData(courseBasket);

  return (
    <div>

      <Navbar />
      
      <Container>
        

<FetchBucket 
  user_id={globalState?.user?.user_id} 
  onBucketsFetched={(buckets) => setBuckets(buckets)} 
  onBucketDeleted={(bucketId) => {
    // Optional: Handle deletion in the parent if needed
  }} 
  onVisualizeBucket={(id, bucket) => {
    var courseIds = bucket.course_ids;
    var noCourses = courseIds.length === 0;
    const coursesToVisualize = claData.claData.filter((course) => 
      courseIds.includes(course.course_title)
    );
    const initialActiveCourses = {};
    coursesToVisualize.forEach((course) => {
      initialActiveCourses[course.course_title] = true; // Mark all courses as active initially
    });
    if (noCourses) {
      setBucketVizName('No courses to visualize in this basket: ' + bucket.bucket_name + ' -- Add courses through Search or delete basket.');
    } else {
      setBucketVizName('Currently visualized basket: ' + bucket.bucket_name);

    }
    setActiveCourses(initialActiveCourses);
    setCourseBasket(coursesToVisualize);

    const logObject = {
      user_id: globalState.user.user_id,
      session_id: globalState.session_id,
      action: "visualize-bucket",
      value: id,
    }

    axios
    .post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
    .then((response) => {
      console.log("Log response:", response);
    })
    .catch((error) => {
      console.error("Error logging:", error);
    });
  }}
/>     
        <div style={{display: 'block', marginTop: '20px'}}>
          <i><b>{bucketVizName}</b></i>
        </div>
        <CourseList>
          {courseBasket.map((course) => (
            <div key={course.course_title}>
              {course.course_title}
              <ToggleButton 
                active={activeCourses[course.course_title]} 
                onClick={() => {
                  setActiveCourses(prevState => ({
                    ...prevState,
                    [course.course_title]: !prevState[course.course_title]
                  }));
                }}
              >
                {activeCourses[course.course_title] ? "Hide" : "Show"}
              </ToggleButton>
            </div>
          ))}
        </CourseList>


        { courseBasket.length > 0 ? (
        <ToggleContainer>
  <ToggleButton active={selectedSemester === "fall24"} onClick={() => setSelectedSemester("fall24")}>
    Fall 2024
  </ToggleButton>
  <ToggleButton active={selectedSemester === "spring25"} onClick={() => setSelectedSemester("spring25")}>
    Spring 2025
  </ToggleButton>
</ToggleContainer>)  : (
  <div></div>
)}

{ courseBasket.length > 0 ? (
        <ResponsiveContainer width="95%" height={400}>
          <LineChart data={showSum ? sumData : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" allowDuplicatedCategory={false} interval={0} />
            <YAxis />
            <Tooltip />
            <Legend content={<CustomLegend />} />
            {showSum ? (
              <>
                {showTL && courseBasket.some(course => activeCourses[course.course_title]) && (
                  <Line type="monotone" dataKey="tl" stroke="#8884d8" />
                )}
                {showME && courseBasket.some(course => activeCourses[course.course_title]) && (
                  <Line type="monotone" dataKey="me" stroke="#82ca9d" />
                )}å¬
                {showPS && courseBasket.some(course => activeCourses[course.course_title]) && (
                  <Line type="monotone" dataKey="ps" stroke="#ffc658" />
                )}
              </>
            ) : (
              courseBasket.map((course) => (
                <>
                  {activeCourses[course.course_title] && showTL && (
                    <Line
                      type="monotone"
                      dataKey="tl"
                      data={individualData[course.course_title]}
                      stroke="#8884d8"
                    />
                  )}
                  {activeCourses[course.course_title] && showME && (
                    <Line
                      type="monotone"
                      dataKey="me"
                      data={individualData[course.course_title]}
                      stroke="#82ca9d"
                    />
                  )}
                  {activeCourses[course.course_title] && showPS && (
                    <Line
                      type="monotone"
                      dataKey="ps"
                      data={individualData[course.course_title]}
                      stroke="#ffc658"
                    />
                  )}
                </>
              ))
            )}
          </LineChart>
        </ResponsiveContainer>) : (
  <div></div>
)}
  { courseBasket.length > 0 ? (
        <ToggleContainer>
          <ToggleButton active={showSum} onClick={() => handleGraphToggle(setShowSum, !showSum, "show-sum")}>
            {showSum ? "Show Course-Level Breakdown" : "Show Semester Load Sum"}
          </ToggleButton>
          <ToggleButton active={showTL} onClick={()  => handleGraphToggle(setShowTL, !showTL, "show-tl")}>
            {showTL ? "Hide Time Load" : "Show Time Load"}
          </ToggleButton>
          <ToggleButton active={showME} onClick={() => handleGraphToggle(setShowME, !showME, "show-me")}>
            {showME ? "Hide Mental Effort" : "Show Mental Effort"}
          </ToggleButton>
          <ToggleButton active={showPS} onClick={() =>  handleGraphToggle(setShowPS, !showPS, "show-ps")}>
            {showPS ? "Hide Psychological Stress" : "Show Psychological Stress"}
          </ToggleButton>
        </ToggleContainer> ) : (<div></div>)}
      </Container>
    </div>
  );
};

export default Graph;