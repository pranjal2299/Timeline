import React from "react";
import { Timeline } from "./Timeline.jsx";
import timelineData from "./Timeline.json";
import "./Timeline.scss";

export const TimelineMain = () => {
  const startTime = 1710725400000;
  const endTime = 1710756000000;
  const title = "{test}";
  
  const legendItems = [
    { color: 'blue', label: 'Category1' },
    { color: 'red', label: 'Category2' },
    { color: 'black', label: 'Category3' }
  ];

  return (
    <>
      <div className="Timeline">
        <Timeline
          title={title}
          data={timelineData}
          startTime={startTime}
          endTime={endTime}
          status={"{Status}"}
          numberOfLabels={10}
          legendItems={legendItems}
        />
      </div>
    </>
  );
};
