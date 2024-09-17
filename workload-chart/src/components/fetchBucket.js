import React, { useState, useEffect } from 'react';
import { AWS_ENDPOINT } from "../config";
import {useGlobalState} from './globalState';
import axios from 'axios';

const FetchBucket = ({ user_id, onBucketsFetched, onBucketDeleted, onVisualizeBucket }) => {
  const [buckets, setBuckets] = useState({});
  const [htmlContent, setHtmlContent] = useState(""); // Optional: for debugging or other purposes
  const [globalState, setGlobalState] = useGlobalState();

  // Fetch buckets
  const fetchBuckets = async () => {
    if (user_id) {
      try {
        const response = await fetch(
          `${AWS_ENDPOINT}/fetch-buckets`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
          }
        );

        if (response.ok) {
          const data = await response.text();
          const parsedData = JSON.parse(data);
          setBuckets(parsedData);
          setHtmlContent(data); // Optional: Set for debugging or other purposes
          console.log("Fetched buckets successfully");
          onBucketsFetched(parsedData); // Pass the fetched buckets to the parent component
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

  // Delete a bucket
  const handleDeleteBucket = async (bucketId) => {
    try {
      const response = await fetch(`${AWS_ENDPOINT}/modify-bucket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          bucket_id: bucketId,
          is_delete: true,
        }),
      });

      if (response.ok) {
        const logObject = {
          user_id: globalState.user.user_id,
          session_id: globalState.session_id,
          action: "delete-bucket",
          value: bucketId,
        }
        axios
        .post(`${AWS_ENDPOINT}/log`, {"log_object": logObject})
        .then((response) => {
          console.log("Log response:", response);
        })
        .catch((error) => {
          console.error("Error logging:", error);
        });
        alert("Bucket deleted successfully!");
        onBucketDeleted(bucketId); // Inform parent component about the deletion
        setBuckets((prevBuckets) => {
          const updatedBuckets = { ...prevBuckets };
          delete updatedBuckets[bucketId];
          return updatedBuckets;
        });
      } else {
        alert("Failed to delete bucket.");
      }
    } catch (error) {
      console.error("Error deleting bucket:", error);
      alert("Error deleting bucket.");
    }
  };

  // Fetch buckets when the component mounts
  useEffect(() => {
    fetchBuckets();
  }, [user_id]);

  return (
    <div>
      <h3 style={{display: 'block', marginBottom: '10px'}}>Your Course Baskets</h3>
      {/* Display fetched buckets */}
      {Object.keys(buckets).length > 0 ? (
        <ul>
          {Object.entries(buckets).map(([id, bucket]) => (
            <li key={id} style={{display: 'block', marginBottom: '10px' }}>
              <strong style={{display: 'block', marginBottom: '10px'}}>{bucket.bucket_name}</strong>
              <button onClick={() => onVisualizeBucket(id, bucket)}>Visualize</button> 
              <button onClick={() => handleDeleteBucket(id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No course baskets available. Please create baskets using Search.</p>
      )}
    </div>
  );
};

export default FetchBucket;
