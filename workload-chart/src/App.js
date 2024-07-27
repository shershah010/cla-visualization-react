import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styled from 'styled-components';
import claData from './data/claData.json';
import semesterData from './data/semesterData.json';
import CustomLegend from './CustomLegend'; // Import custom legend

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

const ToggleButton = styled(Button)`
  background-color: ${props => (props.active ? '#28a745' : '#007bff')};

  &:hover {
    background-color: ${props => (props.active ? '#218838' : '#0056b3')};
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

const processData = (courses) => {
  const weeks = semesterData.fall24.weeks;

  const data = weeks.map((week, index) => {
    const weekKey = `week${index + 1}`;
    const weekData = { name: week[weekKey], tl: 0, me: 0, ps: 0 };

    courses.forEach(course => {
      const courseWeekData = course.fall24.find(w => w[weekKey]);
      if (courseWeekData) {
        weekData.tl += courseWeekData[weekKey].tl;
        weekData.me += courseWeekData[weekKey].me;
        weekData.ps += courseWeekData[weekKey].ps;
      }
    });

    return weekData;
  });

  return data;
};

const processIndividualData = (courses) => {
  const weeks = semesterData.fall24.weeks;
  const data = {};

  courses.forEach(course => {
    const courseData = weeks.map((week, index) => {
      const weekKey = `week${index + 1}`;
      const weekData = { name: week[weekKey], tl: 0, me: 0, ps: 0 };
      const courseWeekData = course.fall24.find(w => w[weekKey]);
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

const App = () => {
  const [courseBasket, setCourseBasket] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSum, setShowSum] = useState(true);
  const [showTL, setShowTL] = useState(true);
  const [showME, setShowME] = useState(true);
  const [showPS, setShowPS] = useState(true);
  const itemsPerPage = 5;

  const handleAddCourse = (course) => {
    if (!courseBasket.includes(course)) {
      setCourseBasket([...courseBasket, course]);
    }
  };

  const handleRemoveCourse = (course) => {
    setCourseBasket(courseBasket.filter(c => c !== course));
  };

  const filteredCourses = claData.claData.filter(course =>
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCourses, totalPages, currentPage]);

  const sumData = processData(courseBasket);
  const individualData = processIndividualData(courseBasket);

  return (
    <Container>
      <Title>Weekly Workload Chart</Title>
      <Input
        type="text"
        placeholder="Search courses"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on new search
        }}
      />
      <CourseList>
        {paginatedCourses.map(course => (
          <div key={course.course_title}>
            {course.course_title}
            <Button onClick={() => handleAddCourse(course)}>Add</Button>
          </div>
        ))}
      </CourseList>
      {filteredCourses.length > itemsPerPage && (
        <Pagination>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Show More Entries
          </Button>
        </Pagination>
      )}
      <ToggleContainer>
        <ToggleButton
          active={showSum}
          onClick={() => setShowSum(!showSum)}
        >
          {showSum ? 'Show Course-Level Breakdown' : 'Show Semester Load Sum'}
        </ToggleButton>
        <ToggleButton
          active={showTL}
          onClick={() => setShowTL(!showTL)}
        >
          {showTL ? 'Hide Time Load' : 'Show Time Load'}
        </ToggleButton>
        <ToggleButton
          active={showME}
          onClick={() => setShowME(!showME)}
        >
          {showME ? 'Hide Mental Effort' : 'Show Mental Effort'}
        </ToggleButton>
        <ToggleButton
          active={showPS}
          onClick={() => setShowPS(!showPS)}
        >
          {showPS ? 'Hide Psychological Stress' : 'Show Psychological Stress'}
        </ToggleButton>
      </ToggleContainer>
      <CourseList>
        {courseBasket.map(course => (
          <div key={course.course_title}>
            {course.course_title}
            <Button onClick={() => handleRemoveCourse(course)}>Remove</Button>
          </div>
        ))}
      </CourseList>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart data={showSum ? sumData : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" allowDuplicatedCategory={false} interval={0}/>
          <YAxis />
          <Tooltip />
          <Legend content={<CustomLegend />} /> {/* Use custom legend */}
          {showSum ? (
            <>
              {showTL && <Line type="monotone" dataKey="tl" stroke="#8884d8" />}
              {showME && <Line type="monotone" dataKey="me" stroke="#82ca9d" />}
              {showPS && <Line type="monotone" dataKey="ps" stroke="#ffc658" />}
            </>
          ) : (
            courseBasket.map(course => (
              <>
                {showTL && <Line type="monotone" dataKey="tl" data={individualData[course.course_title]} stroke="#8884d8" />}
                {showME && <Line type="monotone" dataKey="me" data={individualData[course.course_title]} stroke="#82ca9d" />}
                {showPS && <Line type="monotone" dataKey="ps" data={individualData[course.course_title]} stroke="#ffc658" />}
              </>
            ))            
          )}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default App;
