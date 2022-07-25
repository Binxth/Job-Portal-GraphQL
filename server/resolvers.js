const db = require("./db");

const Query = {
  jobs: () => db.jobs.list(),
  job: (root, args) => db.jobs.get(args.id),
  company: (root, args) => db.companies.get(args.id),
  user: (root, args)=> db.users.get(args.id),
};

// const Mutation = {
//   createJob : (root, {companyId, title, description})=>{
//     const id= db.jobs.create({companyId, title, description});
//     return db.jobs.get(id);
//   }
// };

const Mutation = {
  createJob: (root, { input }, context) => {
    if(!context.user){
      throw new Error("You must be logged in to create a job");
    }
    const id = db.jobs.create({...input, companyId: context.user.companyId});
    return db.jobs.get(id);
  },
};

//as each Job has a Company object not a company id, has to resolve it as below
//resolving fields of Job
const Job = {
  //job is the parent object
  company: (job) => db.companies.get(job.companyId),
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

const User = {
  company : (user)=> db.companies.get(user.companyId)
}

//export all 
module.exports = { Query, Mutation, Job, Company, User };
