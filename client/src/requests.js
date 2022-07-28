import { isLoggedIn, getAccessToken } from "./auth";
import {
  InMemoryCache,
  ApolloClient,
  gql,
  ApolloLink,
  HttpLink,
  concat,
} from "@apollo/client";

const URL = "http://localhost:9000/graphql";

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
    });
  }
  return forward(operation);
});

//uri creates a httplink
const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: URL })]),
  //   link: concat(authLink, new HttpLink({ uri: URL })),
  cache: new InMemoryCache(),
});

export const fetchJobs = async () => {
  //wrap with gql
  const query = gql`
    {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `;
  //setting fetch policy to not to cache
  const resp = await client.query({ query, fetchPolicy: "no-cache" });
  console.log(resp.data.jobs);
  return resp.data.jobs;
};

//get job query extracted out of the function
const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      id
      title
      description
      company {
        id
        name
      }
    }
  }
`;

//get job by id
export const fetchJob = async (id) => {
  const variable = { id: id };
  //passing query and variables
  const res = await client.query({ query: jobQuery, variables: variable });
  return res.data.job;
};

//mutation create job using ApolloClient
export const createJoB = async (input) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const variables = { input };
  const response = await client.mutate({
    mutation,
    variables: variables,
    update: (cache, mutationResult) => {
      cache.writeQuery({query: jobQuery, variables: {id: mutationResult.data.job.id}
      ,data: mutationResult.data})
    },
  });

  //   console.log(data.job.id);
  return response.data.job;
};

export const fetchCompany = async (id) => {
  const query = gql`
    query ($companyId: ID!) {
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
    }
  `;
  const variable = { companyId: id };
  const response = await client.query({ query, variables: variable });
  console.log(response.body);
  return response.data.company;
};

///
///
///
//before updating - get job by id
export const fetchJobOld = async (id) => {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const variable = { id: id };
  //passing query and variables
  const res = await client.query({ query, variables: variable });
  return res.data.job;
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
  };
  if (isLoggedIn()) {
    request.headers["authorization"] = "Bearer " + getAccessToken();
  }
  const response = await fetch(URL, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors
      .map((error) => error.message)
      .join("\n");
    throw new Error(message);
  }
  return responseBody.data;
};
