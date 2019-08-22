// Imports Modules
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');


//Import Models
const User = require('./model/user');
const Job = require('./model/job');
const Company = require('./model/company');
const JobSeeker = require('./model/jobSeeker');
const Education = require('./model/education');

//Import Algorithm
const algorithm = require('./algorithm.js');


//Globals
const app = express();
const PORT = process.env.PORT || 3000;

// Construct a schema, using GraphQL schema language
//! makes a field non-nullable
//MongoDB uses _ for id
//GraphQL has ID type (unique)
const schema = buildSchema(`
  type User {
    _id: ID!
    email: String!
    company: Company
    jobSeeker: JobSeeker
  }
  
  type JobSeeker {
    _id: ID!
    name: String!
    phone: String!
    education: [Education!]
  }
  
  type Job {
    _id: ID!
    name: String!
  }
  
  type Company {
    _id: ID!
    name: String!
    phone: String!
    email: String!
  }
  
  type Education {
    _id: ID!
    level: String!
    field: String!
  }
  
  input JobSeekerInput {
    name: String!
    phone: String!
  }
  
  input UserInput {
    email: String!
  }
  
  input JobInput {
    name: String!
  }
  
  input CompanyInput{
    name: String!
    phone: String!
    email: String!
  }
  
  type Query {
    users: [User!]!
    jobs: [Job!]!
    companies: [Company!]!
  }
  type Mutation {
    createUser(userInput: UserInput): User
    createJob(jobInput: JobInput): Job
    createCompany(companyInput: CompanyInput): Company
  }
  
  schema {
    query: Query
    mutation: Mutation
    }
`);

// Special Functions
//$in matches ids
const getEducationList =  educationIds => {
    return Education.find({ _id: { $in: educationIds } })
        .then( educationList => {
            return educationList.map(education => {
                return{
                    ...education._doc,
                    _id: education.id
                }
            });
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getJobSeeker =  jobSeekerId => {
    return JobSeeker.findById(jobSeekerId)
        .then( jobSeeker => {
            return {
                ...jobSeeker._doc,
                _id: jobSeeker.id,
                education: getEducationList.bind(this, jobSeeker._doc.education)
            };
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getCompany =  companyId => {
    return Company.findById(companyId)
        .then( company => {
            return { ...company._doc, _id: company.id};
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    };

// The root provides a resolver function for each API endpoint
const root = {
    users: () => {
        return User.find().then(users => {
            return users.map(users => {
                return {
                    ...users._doc,
                    _id: users._doc._id.toString(),
                    company: getCompany.bind(this, users._doc.company),
                    jobSeeker: getJobSeeker.bind(this, users._doc.jobSeeker)
                };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    jobs: () => {
        return Job.find().then(jobs => {
            return jobs.map(jobs => {
                return { ...jobs._doc, _id: jobs._doc._id.toString()};
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    companies: () => {
        return Company.find().then(companies => {
            return companies.map(companies => {
                return { ...companies._doc, _id: companies._doc._id.toString()};
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createUser: (args) => {
        const user = new User({
            email: args.userInput.email,
            company: '5d5d1ce7641d92178409aefd',
            jobSeeker: '5d5e16f13c89f0f4489cf499'

            }
        );
        return user.save().then(result => {
            console.log(result);
            return {...result._doc};
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createJob: (args) => {
        const job = new Job({
                name: args.jobInput.name,
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
    createCompany: (args) => {
        const company = new Company({
                name: args.companyInput.name,
                phone: args.companyInput.phone,
                email: args.companyInput.email
            }
        );
        return  company.save().then(result => {
            console.log(result);
            return {...result._doc};
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }
};
//Fixes authentication
app.use(cors());

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


