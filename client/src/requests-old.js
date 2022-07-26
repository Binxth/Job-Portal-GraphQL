import { isLoggedIn, getAccessToken } from "./auth";
const URL = "http://localhost:9000/graphql";

//without refactoring to use graphQL request separately
export const fetchJobs = async () => {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
            {
                jobs {
                  id
                  title
                  company {
                    name
                  }
                }
              }
            `,
    }),
  });
  const responseBody = await response.json();
  // console.log(responseBody.data.jobs);
  return responseBody.data.jobs;
};

//refracted to use graphQL request separately
const graphqlRequest = async (query, variable = {}) => {

  const request = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variable,
    }),
  }  
  if (isLoggedIn()) {
    request.headers["authorization"] = "Bearer " + getAccessToken();
  }
  const response = await fetch(URL,request );
  const responseBody = await response.json();
  // console.log(responseBody.errors.map((error)=>error.message))
  if (responseBody.errors) {
    const message = responseBody.errors
      .map((error) => error.message)
      .join("\n");
    throw new Error(message);
  }
  // console.log((responseBody.data));
  return responseBody.data;
};

//get job by id
export const fetchJob = async (id) => {
  const query = `query JobQuery($id: ID! ) {
    job(id: $id) {
        id
    title
    description
    company {
        id
        name
    }
    }
      }`;
  const variable = { id: id };
  const data = await graphqlRequest(query, variable);

  return data.job;
};

//without refactoring get company by id
export const fetchCompany = async (id) => {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
  query($companyId: ID!){
    company(id: $companyId) {
        id
        description
        name
        jobs {
          id
          title
          description
        }
    }
}`,
      variables: { companyId: id },
    }),
  });
  const responseBody = await response.json();
  console.log(responseBody.data.company);
  return responseBody.data.company;
};


//mutation using graphql request - create job
export const createJoB = async (input) => {
  const mutation = `mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      id
      title
    }
  }
  `;
  const variables = {input};
  const data = await graphqlRequest(mutation,variables);
  // console.log(data.job.id);
  return data.job;
};
