import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import levenshtein from 'fast-levenshtein';
import Highlighter from 'react-highlight-words';
import ReactPaginate from 'react-paginate';
import claData from '../data/claData.json';
import { useGlobalState } from './globalState';
import { useNavigate } from 'react-router';
import { AWS_ENDPOINT } from '../config';
import Navbar from './navbar';

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

  const [baskets, setBaskets] = useState([{ name: 'New Basket', courses: [] }]);
  const [currentBasketIndex, setCurrentBasketIndex] = useState(0);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newBasketName, setNewBasketName] = useState('');

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
        Math.min(...course["course_title"]
          .toLowerCase()
          .split(" ")
          .map(word => levenshtein.get(word, searchTerm.toLowerCase()))
        )
      ])
      .sort((a, b) => a[1] - b[1])
      .map(a => a[0]);

    setSearchCourses(courses);
    setCourseOffset(0);
  };

  // Fetch buckets
  const fetchBuckets = async () => {
    if (globalState?.user?.user_id) {
      try {
        const response = await fetch(
          `${AWS_ENDPOINT}/fetch-buckets`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: globalState.user.user_id }),
          }
        );

        if (response.ok) {
          const data = await response.text();
          const parsedData = JSON.parse(data);
          // Convert fetched buckets to a format suitable for the current basket system
          const newBaskets = Object.entries(parsedData).map(([key, bucket]) => ({
            id: key, // Use the key as the id
            name: bucket.bucket_name,
            courses: bucket.course_ids.map(course_id => ({ course_title: course_id }))
          }));

          // Add fetched baskets to the current basket state
          setBaskets([...baskets, ...newBaskets]);
        } else {
          console.error("Failed to fetch buckets");
        }
      } catch (error) {
        console.error("Error occurred during fetchBuckets", error);
      }
    } else {
      console.log("user_id not available");
    }
  };

  // Function to handle adding a course to the current basket
  const addCourseToBasket = (course) => {
    const currentBasket = baskets[currentBasketIndex];
    const courseExists = currentBasket.courses.some(
      (existingCourse) => existingCourse.course_title === course.course_title
    );

    if (courseExists) {
      alert('This course is already in the basket.');
      return;
    }

    const updatedBaskets = [...baskets];
    updatedBaskets[currentBasketIndex].courses.push(course);
    setBaskets(updatedBaskets);
  };

  const changeBasket = (index) => {
    setCurrentBasketIndex(index);
  };

  const addNewBasket = () => {
    setBaskets([...baskets, { name: `Basket ${baskets.length + 1}`, courses: [] }]);
    setIsRenaming(false);
    startRenamingBasket();
    changeBasket(baskets.length);
  };

  const startRenamingBasket = () => {
    setIsRenaming(true);
    setNewBasketName(baskets[currentBasketIndex].name);
  };

  const renameBasket = () => {
    const updatedBaskets = [...baskets];
    updatedBaskets[currentBasketIndex].name = newBasketName;
    setBaskets(updatedBaskets);
    setIsRenaming(false);
  };

  useEffect(() => {
    checkAuthentication();
    fetchBuckets(); // Fetch buckets when the component mounts
  }, [globalState]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * coursesPerPage) % searchCourses.length;
    setCourseOffset(newOffset);
  };

  const removeCourseFromBasket = (course) => {
    const updatedBaskets = [...baskets];
    updatedBaskets[currentBasketIndex].courses = updatedBaskets[currentBasketIndex].courses.filter(
      (existingCourse) => existingCourse.course_title !== course.course_title
    );
    setBaskets(updatedBaskets);
  };

  // Save or modify bucket
  const saveBucket = async () => {
    const currentBasket = baskets[currentBasketIndex];
    const bucketName = currentBasket.name;
    const courseIds = currentBasket.courses.map(course => course.course_title);

    try {
      // Check if a bucket with the same name exists
      const existingBucket = baskets.find((basket) => basket.name === bucketName); // needs fixing, skip for now
      if (existingBucket.id) {
        // Modify the existing bucket
        const response = await fetch(`${AWS_ENDPOINT}/modify-bucket`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: globalState?.user?.user_id,
            bucket_id: existingBucket.id,
            bucket_name: bucketName,
            course_ids: courseIds,
            is_delete: false,
          }),
        });

        if (response.ok) {
          alert("Bucket modified successfully!");
        } else {
          alert("Failed to modify bucket.");
        }
      } else {
        // Create a new bucket
        const response = await fetch(`${AWS_ENDPOINT}/create-bucket`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: globalState?.user?.user_id,
            bucket_name: bucketName,
            course_ids: courseIds,
          }),
        });

        if (response.ok) {
          alert("Bucket created successfully!");
        } else {
          alert("Failed to create bucket.");
        }
      }
    } catch (error) {
      console.error("Error saving bucket:", error);
      alert("Error saving bucket.");
    }
  };

  return (
    <div>
      <Navbar />

      <Container>
      

        {/* Basket selection and display */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', width: '90vw'}}>
  {/* Block 1: Basket Controls */}
  <div style={{ flex: '1', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
    <h2 style={{ display: 'block', marginBottom: '10px' }}>Options</h2>
    <button onClick={addNewBasket} style={{ display: 'block', marginBottom: '10px' }}>Add New Basket</button>
    <button onClick={startRenamingBasket} style={{ display: 'block', marginBottom: '10px' }}>Rename Basket</button>
    <button onClick={saveBucket} style={{ display: 'block', marginBottom: '10px' }}>Save Current Basket</button>

    {isRenaming && (
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newBasketName}
          onChange={(e) => setNewBasketName(e.target.value)}
          style={{ marginRight: '5px' }}
        />
        <button onClick={renameBasket}>Save</button>
      </div>
    )}
  </div>

  {/* Block 2: Basket List */}
  <div style={{ flex: '1', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>
    <h3 style={{ display: 'block', marginBottom: '10px' }}>My Baskets</h3>
    <div>
      {baskets.map((basket, index) => (
        <button 
          key={index}
          onClick={() => changeBasket(index)}
          style={{ 
            fontWeight: currentBasketIndex === index ? 'bold' : 'normal',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          {basket.name}
        </button>
      ))}
    </div>
  </div>

  {/* Block 3: Courses in Current Basket */}
<div style={{ flex: '3', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
  <h3 style={{ display: 'block', marginBottom: '10px' }}>Courses in {baskets[currentBasketIndex].name}:</h3>
  <ul>
    {baskets[currentBasketIndex].courses.map((course, index) => (
      <li key={index} style={{display: 'block', marginBottom: '10px' }}>
        {course.course_title}
        <button onClick={() => removeCourseFromBasket(course)} style={{ marginLeft: '10px' }}>
          Remove
        </button>
      </li>
    ))}
  </ul>
</div>
</div>



        <div>
          <Title>Search</Title>

          <h3>Search for courses by entering text below:</h3>
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
                <button onClick={() => addCourseToBasket(course)}>Add to Basket</button>
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
