import React, { Component, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { companies } from "./fake-data";
import { fetchCompany } from "./requests";

export const CompanyDetail = (props) => {
  const params = useParams();
  const { companyId } = params;

  const [company, setCompany] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCompany();
  }, []);

  const getCompany = async () => {
    const companyObj = await fetchCompany(companyId);
    setCompany(companyObj);
    setIsLoading(false);
  };

  return isLoading ? (
    <></>
  ) : (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">
        <h4 className="subtitle is-4">{company.description}</h4></div>

      <h5 className="title is-5">Jobs offered by us</h5>
      <ul className="box">
        {company.jobs.map((job) => {
          return (
            <>
              <li className="media" key={job.id}>
                <div className="media-content">
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                  <h5>{job.description}</h5>
                </div>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

// export class CompanyDetail extends Component {
//   constructor(props) {
//     super(props);
//     const {companyId} = this.props.match.params;
//     this.state = {company: companies.find((company) => company.id === companyId)};
//   }

//   render() {
//     const {company} = this.state;
//     return (
// <div>
//   <h1 className="title">{company.name}</h1>
//   <div className="box">{company.description}</div>
// </div>
//     );
//   }
// }
