import React, { Component, useEffect, useState } from 'react';
import {createJoB } from './requests';
import { useHistory } from "react-router";


export const JobForm=()=>{
  const history = useHistory();

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  async function handleClick(event) {
    event.preventDefault();
    const companyId = 'HJRa-DOuG'
    const job = await createJoB({companyId,title, description});
    // console.log(job);
    // const job = await createJoB( {companyId: 'HJRa-DOuG', title: 'asd', description: 'asdasd'});
    history.push(`/jobs/${job.id}`);
  }

  function handleChange(event) {
    const value = event.target.value;
    setDescription(value);
    // console.log(description);
  }

  return (<div>
    <h1 className="title">New Job</h1>
    <div className="box">
      <form>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" type="text" name="title" value={title}
              onChange={(e)=>{setTitle(e.target.value)}} />
          </div>
        </div>
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <textarea className="input" style={{height: '10em'}}
              name="description" value={description}  onChange={handleChange} />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-link" onClick={handleClick}>Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>);
}



