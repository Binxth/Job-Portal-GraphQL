import React, { Component, useEffect, useState } from "react";
import { JobList } from "./JobList";
const { jobs } = require("./fake-data");
const { fetchJobs, fetchJob } = require("./requests");

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    
    const jobsPromise = fetchJobs();
    jobsPromise.then((jobs) => {
      setJobs(jobs);
    });
   
  }, []);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
