import React from 'react';

const CustomLegend = ({ payload }) => {
  // Filter out entries you don't want to display in the legend
  const filteredPayload = payload.filter(entry => !(entry.value.includes(' PS')|entry.value.includes(' ME')|entry.value.includes(' TL')));
  // Step 2: Extract unique values
  const uniqueValues = Array.from(new Set(filteredPayload.map(entry => entry.value)));

  // Optional: If you want to keep the original entries but only with unique values
  const uniqueFilteredPayload = filteredPayload.filter((entry, index, self) => 
    index === self.findIndex(t => t.value === entry.value)
  );

  const labelMapping = {
    tl: 'Time Load',
    me: 'Mental Effort',
    ps: 'Psychological Stress'
  };

  return (
    <div className="custom-legend">
      {uniqueFilteredPayload.map((entry, index) => (
        <div key={`item-${index}`} style={{ color: entry.color }}>
          {labelMapping[entry.dataKey] || entry.value}
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;

