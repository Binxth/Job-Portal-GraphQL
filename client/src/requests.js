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


//refracted
const graphqlRequest = async (query,variable={}) => {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables : variable
    }),
  });
  const responseBody = await response.json();
  // console.log(responseBody.errors.map((error)=>error.message))
  if(responseBody.errors){
    const message = responseBody.errors.map((error)=>error.message).join('\n');
    throw new Error(message);
  }
  return responseBody.data;
};

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
      }`
  const variable = { "id": id }
  const data = await graphqlRequest(query,variable);

  return data.job;
};



//without refactoring
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
  console.log(responseBody.data.company)
  return responseBody.data.company;
};
