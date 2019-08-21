// Imports Modules
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');


//Import Models
const User = require('./model/user');
const Job = require('./model/job');
const Company = require('./model/company');

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
    company: Company!
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

// Special Function

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
                    company: getCompany.bind(this, users._doc.company)
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
                return { ...companies._doc, _id: companies._doc._id.toString(), name: "fake name"};
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createUser: (args) => {
        const user = new User({
                email: args.userInput.email,
                company: '5d5d1ce7641d92178409aefd'
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

//Add cors
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


