import React, { useState } from "react";
import { useGlobalState } from "./globalState";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const FormField = styled.div`
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CreateBucketForm = () => {
  const [bucketName, setBucketName] = useState("");
  const [courseIds, setCourseIds] = useState("");
  const [globalState, setGlobalState] = useGlobalState();

  const handleCreateBucket = async () => {
    if (!bucketName || !courseIds) {
      alert("Please provide both a bucket name and course IDs.");
      return;
    }

    const courseIdsArray = courseIds.split(",").map((id) => id.trim());

    try {
      const response = await fetch("https://bgxc1mncrb.execute-api.us-west-1.amazonaws.com/prod/create-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: globalState?.user?.user_id,
          bucket_name: bucketName,
          course_ids: ['ABC', 'AC', 'AA'],
        }),
      });

      if (response.ok) {
        alert("Bucket created successfully!");
        setBucketName("");
        setCourseIds("");
      } else {
        alert("Failed to create bucket.");
      }
    } catch (error) {
      console.error("Error creating bucket:", error);
      alert("Error creating bucket.");
    }
  };

  return (
    <FormContainer>
      <h2>Create Bucket</h2>
      <FormField>
        <label>Bucket Name:</label>
        <input
          type="text"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
        />
      </FormField>
      <FormField>
        <label>Course IDs (comma separated):</label>
        <input
          type="text"
          value={courseIds}
          onChange={(e) => setCourseIds(e.target.value)}
        />
      </FormField>
      <Button onClick={handleCreateBucket}>Create Bucket</Button>
    </FormContainer>
  );
};

export default CreateBucketForm;
