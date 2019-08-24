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
    company: Company
    education: [Education!]
    description: String!
  }
  
  type Company {
    _id: ID!
    name: String!
    phone: String!
    email: String!
    logoUrl: String
  }
  
  type Education {
    _id: ID!
    level: String!
    field: String!
  }
  
  type JobSeekerMatch {
    score: Float!
    job: Job!
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
  
  input EducationInput {
    level: String!
    field: String!
  }
  
  type Query {
    users: [User!]!
    jobs: [Job!]!
    companies: [Company!]!
    jobSeekerMatch(id: String!): [JobSeekerMatch]
  }
  type Mutation {
    createUser(userInput: UserInput): User
    createJob(jobInput: JobInput): Job
    createCompany(companyInput: CompanyInput): Company
    createEducation(educationInput: EducationInput): Education
  }
  
  schema {
    query: Query
    mutation: Mutation
    }
`);

// Special Functions
//$in matches ids

const getEducationList =  educationIds => {
    return Education.find({_id: { $in: educationIds } })
        .then( educations => {
            return educations.map(education => {
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
    if (jobSeekerId == null){
        return null;
    }
    else{
        return JobSeeker.findById(jobSeekerId)
            .then( jobSeeker => {
                    return {
                        ...jobSeeker._doc,
                        _id: jobSeeker.id,
                        education: getEducationList.bind(this, jobSeeker._doc.education)

                    };

                }
            )
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

};

const getCompany =  companyId => {
    if (companyId == null){
        return null;
    }
    else{
        return Company.findById(companyId)
            .then( company => {
                return { ...company._doc, _id: company.id};
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    };

// The root provides a resolver function for each API endpoint
const root = {
    jobSeekerMatch: async (args) => {
        const jobSeekerEducation = [];
        const matches = []

        try {
            const user = await User.findById(args.id);
            const jobSeeker = await JobSeeker.findById(user.jobSeeker);

            for (var i=0;i < jobSeeker.education.length; i++)
            {
                const newEducation = await Education.findById(jobSeeker.education[i]);
                jobSeekerEducation.push({level: newEducation.level, field: newEducation.field});
            }
        } catch (err) {
            throw err;
        }

        try {
            const jobs = await Job.find({});
            const jobEducation = [];

            for (var i=0;i < jobs.length; i++)
            {
                var currentJob = jobs[i];

                const newCompany = await Company.findById(currentJob.company);
                const currentCompany = {id: newCompany._id, name: newCompany.name, phone: newCompany.phone, email: newCompany.email, logoUrl: newCompany.logoUrl};

                for (var j=0;j < currentJob.education.length; j++){
                    const newEducation = await Education.findById(currentJob.education[j]);
                    jobEducation.push({_id: newEducation._id, level: newEducation.level, field: newEducation.field});
                }

                var match = algorithm.match(jobEducation, jobSeekerEducation);
                matches.push({
                    score: match,
                    job: {
                        _id: currentJob._id,
                        name: currentJob.name,
                        company: {
                            _id: currentCompany.id,
                            name: currentCompany.name,
                            phone: currentCompany.phone,
                            email: currentCompany.email,
                            logoUrl: currentCompany.logoUrl

                        },
                        education: jobEducation,
                        description: currentJob.description
                    }
                });
            }
            //console.log(jobEducation);

        } catch (err) {
            throw err;
        }
        return matches;
    },
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
                return {
                    ...jobs._doc,
                    _id: jobs._doc._id.toString(),
                    company: getCompany.bind(this, jobs._doc.company),

                };
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
            jobSeeker: null

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
    },
    createEducation: (args) => {
        const education = new Education({
                level: args.educationInput.level,
                field: args.educationInput.field
            }
        );
        return  education.save().then(result => {
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


