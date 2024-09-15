import React, { useState } from "react";

const FetchBucket = ({ user_id }) => {
  const [htmlContent, setHtmlContent] = useState("");

  const fetchBuckets = async () => {
    if (user_id) {
      try {
        const response = await fetch(
          "https://bgxc1mncrb.execute-api.us-west-1.amazonaws.com/prod/fetch-buckets",
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
          setHtmlContent(data);
          console.log("Fetched buckets successfully");
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

  return (
    <div>
      <button onClick={fetchBuckets}>Fetch Buckets</button>
      {/* Render HTML content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    </div>
  );
};

export default FetchBucket;
