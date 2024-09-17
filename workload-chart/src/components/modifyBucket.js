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
  background-color: #28a745;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const ModifyBucketForm = () => {
  const [bucketId, setBucketId] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [courseIds, setCourseIds] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [globalState, setGlobalState] = useGlobalState();

  const handleModifyBucket = async () => {
    try {
      const response = await fetch("https://bgxc1mncrb.execute-api.us-west-1.amazonaws.com/prod/modify-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: globalState?.user?.user_id,
          bucket_id: bucketId,
          is_delete: isDelete,
          ...(isDelete
            ? {}
            : {
                bucket_name: bucketName || undefined,
                course_ids: ['new', 'mod!']//courseIds ? courseIds.split(",").map((id) => id.trim()) : undefined,
              }),
        }),
      });

      if (response.ok) {
        alert(isDelete ? "Bucket deleted successfully!" : "Bucket modified successfully!");
        setBucketId("");
        setBucketName("");
        setCourseIds("");
        setIsDelete(false);
      } else {
        alert("Failed to modify bucket.");
      }
    } catch (error) {
      console.error("Error modifying bucket:", error);
      alert("Error modifying bucket.");
    }
  };

  return (
    <FormContainer>
      <h2>Modify Bucket</h2>
      <FormField>
        <label>Bucket ID:</label>
        <input
          type="text"
          value={bucketId}
          onChange={(e) => setBucketId(e.target.value)}
        />
      </FormField>
      <FormField>
        <label>New Bucket Name (optional):</label>
        <input
          type="text"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          disabled={isDelete}
        />
      </FormField>
      <FormField>
        <label>Course IDs (comma separated, optional):</label>
        <input
          type="text"
          value={courseIds}
          onChange={(e) => setCourseIds(e.target.value)}
          disabled={isDelete}
        />
      </FormField>
      <FormField>
        <label>
          <input
            type="checkbox"
            checked={isDelete}
            onChange={() => setIsDelete(!isDelete)}
          />
          Delete Bucket
        </label>
      </FormField>
      <Button onClick={handleModifyBucket}>
        {isDelete ? "Delete Bucket" : "Modify Bucket"}
      </Button>
    </FormContainer>
  );
};

export default ModifyBucketForm;
