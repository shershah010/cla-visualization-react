import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from "react-bootstrap";
import levenshtein from 'fast-levenshtein';
import Highlighter from 'react-highlight-words';
import ReactPaginate from 'react-paginate';
import claData from '../data/claData.json';
import { useGlobalState } from './globalState';
import { useNavigate } from 'react-router';
import { AWS_ENDPOINT } from '../config';
import Navbar from './navbar';
import axios from 'axios';

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

    const logObject = {
      user_id: globalState.user.user_id,
      session_id: globalState.session_id,
      action: "search",
      value: searchTerm,
    }

    axios
      .post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error logging search:", error);
      });

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
          setBaskets([...newBaskets]);
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
    // Check if there are no baskets
    if (baskets.length === 0) {
      alert('No basket exists. Please create a new basket first.');
      return;
    }
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
    setBaskets([...baskets, { name: `New Basket`, courses: [] }]);
    setIsRenaming(false);
    startRenamingBasket();
    changeBasket(baskets.length);
  };

  const startRenamingBasket = () => {
    if (baskets.length === 0) {
      // Initialize a new basket if no basket exists
      const newBasket = { name: `New Basket`, courses: [] };
      setBaskets([newBasket]);
      setCurrentBasketIndex(0);
      setNewBasketName(newBasket.name);
    } else {
      // If baskets exist, proceed with renaming
      setIsRenaming(true);
      setNewBasketName("New Basket");
    }
    setIsRenaming(true);
  };  

  const renameBasket = () => {
    const nameExists = baskets.some((basket) => basket.name === newBasketName);
    if (nameExists) {
      alert(`${newBasketName} already exists. Please choose a different name for this basket.`);
      return;
    }

    if (newBasketName==='New Basket') {
      alert('Please give the your basket a name other than "New Basket"');
      return;
    }
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
      const existingBucket = baskets.find((basket) => basket.name === bucketName); 
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
          const logObject = {
            user_id: globalState.user.user_id,
            session_id: globalState.session_id,
            action: "modify-bucket",
            value: existingBucket.id,
          }
          axios
          .post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error("Error logging modify-bucket:", error);
          });
          alert("Basket modified successfully!");
        } else {
          alert("Failed to modify basket.");
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
          const responseData = await response.json();
          const logObject = {
            user_id: globalState.user.user_id,
            session_id: globalState.session_id,
            action: "create-bucket",
            value: responseData,
          }
          axios
          .post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error("Error logging create-bucket:", error);
          });
          alert("Basket created successfully!");
          fetchBuckets(); // Re-fetch the buckets after creation
        } else {
          alert("Failed to create basket.");
        }
      }
    } catch (error) {
      console.error("Error saving bucket:", error);
      alert("Error saving basket.");
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
    <h3 style={{ display: 'block', marginBottom: '10px' }}>Options</h3>
    <Button className="button" onClick={addNewBasket} style={{ display: 'block', marginBottom: '10px' }}>Add New Basket</Button>
    <Button className="button" onClick={startRenamingBasket} style={{ display: 'block', marginBottom: '10px' }}>Rename Basket</Button>
    <Button className="button" onClick={saveBucket} style={{ display: 'block', marginBottom: '10px' }}>Save Current Basket</Button>

    {isRenaming && (
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newBasketName}
          onChange={(e) => setNewBasketName(e.target.value)}
          style={{ marginRight: '5px' }}
        />
        <Button className="button" onClick={renameBasket}>Save</Button>
      </div>
    )}
  </div>

  {/* Block 2: Basket List */}
  <div style={{ flex: '1', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>
    <h3 style={{ display: 'block', marginBottom: '10px' }}>My Baskets</h3>
    <div>
      {baskets.map((basket, index) => (
        <Button 
        className="button"
          key={index}
          onClick={() => changeBasket(index)}
          style={{ 
            fontWeight: currentBasketIndex === index ? 'bold' : 'normal',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          {basket.name}
        </Button>
      ))}
    </div>
  </div>

  {/* Block 3: Courses in Current Basket */}
  <div style={{ flex: '3', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
  {baskets.length > 0 && baskets[currentBasketIndex] ? (
    <>
      <h3 style={{ display: 'block', marginBottom: '10px' }}>Courses in {baskets[currentBasketIndex].name}:</h3>
      <ul>
        {baskets[currentBasketIndex].courses.map((course, index) => (
          <li key={index} style={{display: 'block', marginBottom: '10px' }}>
            {course.course_title}
            <Button className="button" onClick={() => removeCourseFromBasket(course)} style={{ marginLeft: '10px' }}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <h3 style={{ display: 'block', marginBottom: '10px' }}>No baskets available. Please create a new basket.</h3>
  )}
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
                <p>Time Load: {course.total.tl.toFixed(2)}</p>
                <p>Mental Effort: {course.total.me.toFixed(2)}</p>
                <p>Psychological Stress: {course.total.ps.toFixed(2)}</p>
                <p>Combined Course Load: {course.total.cl_combined.toFixed(2)}</p>
                <p>Credit Hours: {course.total.ch.toFixed(2)}</p> 
                <Button className="button" style={{ marginBottom: '0px' }} onClick={() => addCourseToBasket(course)}>Add to Basket</Button>
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
