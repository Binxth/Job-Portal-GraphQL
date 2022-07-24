import React, { Component } from 'react';
import { Link,useParams } from 'react-router-dom';


export const JobList=(props)=>{

  const {jobs} = props;

  return(
      <ul className="box">
        {jobs.map((job)=>renderJob(job))}
      </ul>
  )
}

 function renderJob(job) {
    const title = job.company ? `${job.title} at ${job.company.name}` : job.title;
    return (
      <li className="media" key={job.id}>
        <div className="media-content">
          <Link to={`/jobs/${job.id}`}>{title}</Link>
        </div>
      </li>
    );
  }

