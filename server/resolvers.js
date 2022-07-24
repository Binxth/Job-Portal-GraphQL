const db = require('./db')

const Query = {
  jobs: () =>  db.jobs.list(),
  job:(root, args)=> db.jobs.get(args.id),
  company:(root,args)=>db.companies.get(args.id),
  
};

//as each Job has a Company object not a company id, has to resolve it as below
//resolving fields of Job
const Job = {
  //job is the parent object
  company: (job)=> db.companies.get(job.companyId)
}

const Company = {
  jobs: (company) => db.jobs.list().filter(
    (job)=> job.companyId === company.id
  )
}

//export all resolvers
module.exports = { Query, Job,Company };
