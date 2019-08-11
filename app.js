// Imports Modules
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');

//Import Models
const JobSeeker = require('./model/jobSeeker');
const Job = require('./model/job');
const Employer = require('./model/employer');

//Globals
const app = express();
const PORT = process.env.PORT || 3000;


// Construct a schema, using GraphQL schema language
//! makes a field non-nullable
//MongoDB uses _ for id
//GraphQL has ID type (unique)
const schema = buildSchema(`
  type JobSeeker {
    _id: ID!
    name: String!
    phone: String!
    email: String!
    description: String!
  }
  
  type Job {
    _id: ID!
    name: String!
  }
  
  type Employer {
    _id: ID!
    name: String!
    phone: String!
    email: String!
  }
  
  input JobSeekerInput {
    name: String!
    phone: String!
    email: String!
    description: String!
  }
  
  input JobInput {
    name: String!
  }
  
  input EmployerInput{
    name: String!
    phone: String!
    email: String!
  }
  
  type Query {
    jobSeekers: [JobSeeker!]!
    job: [Job!]!
  }
  type Mutation {
    createJobSeeker(jobSeekerInput: JobSeekerInput): JobSeeker
    createJob(jobInput: JobInput): Job
    createEmployer(employerInput: EmployerInput): Employer
  }
  
  schema {
    query: Query
    mutation: Mutation
    }
`);

// The root provides a resolver function for each API endpoint
const root = {
    jobSeekers: () => {
        return JobSeeker.find().then(jobSeekers => {
            return jobSeekers.map(jobSeeker => {
                return { ...jobSeeker._doc, _id: jobSeeker._doc._id.toString()};
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    job: () => {
        return Job.find().then(job => {
            return job.map(job => {
                return { ...job._doc, _id: job._doc._id.toString()};
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createJobSeeker: (args) => {
        const jobSeeker = new JobSeeker({
                name: args.jobSeekerInput.name,
                phone: args.jobSeekerInput.phone,
                email: args.jobSeekerInput.email,
                description: args.jobSeekerInput.description
            }
        );
        return jobSeeker.save().then(result => {
            console.log(result);
            return {...result._doc};
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createJob: (args) => {
        const job = new Job({
                name: args.jobInput.name
            }
        );
        return job.save().then(result => {
            console.log(result);
            return {...result._doc};
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createEmployer: (args) => {
        const employer = new Employer({
                name: args.employerInput.name,
                phone: args.employerInput.phone,
                email: args.employerInput.email
            }
        );
        return employer.save().then(result => {
            console.log(result);
            return {...result._doc};
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }
};

//Graphql Endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

//Database connection check via mongoose and port
//Async promise
mongoose
    .connect(
        `mongodb+srv://matchme:S1eDmHKdzWnGLR02@matchmemongo-f5qtv.mongodb.net/matchmedb?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });


