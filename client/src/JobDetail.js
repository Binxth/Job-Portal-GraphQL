import React, { Component,useState,useEffect } from 'react';

import { Link, useParams} from 'react-router-dom';
// import { jobs } from './fake-data';
import { fetchJob } from './requests';



function JobDetail(props){
  // console.log(props);
  const params = useParams()
  // console.log(params);

  const {jobId} = params;
  // console.log(jobId) 

  const [job, setJob] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jobPromise = fetchJob(jobId);
    jobPromise.then((e)=>{
      setJob(e)
      setIsLoading(false);
    });
  }, [])
  

  return ( 
    (isLoading) ? 
    <div></div> : 
    (<div>
    <h1 className="title">{job.title}</h1>
    <h2 className="subtitle">
      <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
    </h2>
    <div className="box">{job.description}</div>
  </div>)
  )
}

export default JobDetail;





