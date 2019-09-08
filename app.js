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
const Competence = require('./model/competence');

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
    isCompany: Boolean!
  }
  
  type JobSeeker {
    _id: ID!
    name: String!
    phone: String!
    education: [Education!]
    competence: [Competence!]
    completeJobMatch: [Job!]
  }
  
  type Job {
    _id: ID!
    name: String!
    company: Company
    education: [Education!]
    competence: [Competence!]
    description: String!
    jobSeekerInterest: [User!]
    companyInterest: [User!]
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

  type Competence {
    _id: ID!
    skill: String!
    level: String!
  }
  
  type JobSeekerMatch {
    score: Float!
    job: Job!
  }
  
  type JobMatch {
    score: Float!
    user: User!
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

  input CompetenceInput {
    skill: String!
    level: String!
  }
  
  input AcceptJobInput {
    userId: String!
    jobId: String!
  }
  
  
  type Query {
    users: [User!]!
    jobs: [Job!]!
    companies: [Company!]!
    jobSeekerMatch(id: String!): [JobSeekerMatch]
    jobMatch(id: String!): [JobMatch]
    jobSeekerCompleteMatches (id: String!) : [Job]
  }
  type Mutation {
    createUser(userInput: UserInput): User
    createJob(jobInput: JobInput): Job
    createCompany(companyInput: CompanyInput): Company
    createEducation(educationInput: EducationInput): Education
    createCompetence(competenceInput: CompetenceInput): Competence
    acceptJob(acceptJobInput: AcceptJobInput): String
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

const getCompetenceList =  competenceIds => {
    return Competence.find({_id: { $in: competenceIds } })
        .then( competence => {
            return competence.map(competence => {
                return{
                    ...competence._doc,
                    _id: competence.id
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
                        education: getEducationList.bind(this, jobSeeker._doc.education),
                        competence: getCompetenceList.bind(this, jobSeeker._doc.competence)
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
//Mutation add, queries return
const root = {
    jobSeekerCompleteMatches: async (args) => {
        var currUser = null;
        var currJobSeeker = null;
        try {
            currUser = await User.findById(args.id);
            currJobSeeker = await JobSeeker.findById(currUser.jobSeeker);
        }
        catch (err) {
            throw err;
        }
        return Job.find({_id: { $in: currJobSeeker.completeJobMatch } }).then(jobs => {
            return jobs.map(jobs => {
                return {
                    ...jobs._doc,
                    _id: jobs._doc._id.toString(),
                    company: getCompany.bind(this, jobs._doc.company),
                    education: getEducationList.bind(this, jobs._doc.education),
                    competence: getCompetenceList.bind(this, jobs._doc.competence)

                };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    jobMatch: async (args) => {
        const jobEducation = [];
        const jobCompetence = []
        const matches = []

        try {
            const job = await Job.findById(args.id);

            for (var i=0;i < job.education.length; i++)
            {
                const newEducation = await Education.findById(job.education[i]);
                jobEducation.push({level: newEducation.level, field: newEducation.field});
            }

            for (var i=0;i < job.competence.length; i++)
            {
                const newCompetence = await Competence.findById(job.competence[i]);
                jobCompetence.push({skill: newCompetence.skill, level: newCompetence.level});
            }
        } catch (err) {
            throw err;
        }

        try {
            const users = await User.find({isCompany: false});


            for (var i=0;i < users.length; i++)
            {
                var currentUser = users[i];
                var currentJobSeeker = await JobSeeker.findById(currentUser.jobSeeker);
                const userEducation = [];
                const userCompetence = [];

                for (var j=0;j < currentJobSeeker.education.length; j++){
                    const newEducation = await Education.findById(currentJobSeeker.education[j]);
                    userEducation.push({_id: newEducation._id, level: newEducation.level, field: newEducation.field});
                }

                for (var j=0;j < currentJobSeeker.competence.length; j++){
                    const newCompetence = await Competence.findById(currentJobSeeker.competence[j]);
                    userCompetence.push({_id: newCompetence._id, skill: newCompetence.skill, level: newCompetence.level});
                }

                var match = algorithm.match(jobEducation, userEducation,jobCompetence, userCompetence);
                matches.push({
                    score: match,
                    user: {
                        _id: currentUser._id,
                        email: currentUser.email,
                        company: null,
                        jobSeeker: {
                            _id: currentJobSeeker.id,
                            name: currentJobSeeker.name,
                            phone: currentJobSeeker.phone,
                            education: userEducation,
                            competence: userCompetence
                        },
                        isCompany: currentUser.isCompany
                    }
                });
            }

        } catch (err) {
            throw err;
        }
        return matches;
    },
    jobSeekerMatch: async (args) => {
        const jobSeekerEducation = [];
        const jobSeekerCompetence = [];

        const matches = []

        try {
            const user = await User.findById(args.id);
            const jobSeeker = await JobSeeker.findById(user.jobSeeker);

            for (var i=0;i < jobSeeker.education.length; i++)
            {
                const newEducation = await Education.findById(jobSeeker.education[i]);
                jobSeekerEducation.push({level: newEducation.level, field: newEducation.field});
            }
            for (var i=0;i < jobSeeker.competence.length; i++)
            {
                const newCompetence = await Competence.findById(jobSeeker.competence[i]);
                jobSeekerCompetence.push({skill: newCompetence.skill, level: newCompetence.level});
            }
        } catch (err) {
            throw err;
        }

        try {
            const jobs = await Job.find({});

            for (var i=0;i < jobs.length; i++)
            {
                var currentJob = jobs[i];
                const jobEducation = [];
                const jobCompetence = [];

                const newCompany = await Company.findById(currentJob.company);
                const currentCompany = {id: newCompany._id, name: newCompany.name, phone: newCompany.phone, email: newCompany.email, logoUrl: newCompany.logoUrl};

                for (var j=0;j < currentJob.education.length; j++){
                    const newEducation = await Education.findById(currentJob.education[j]);
                    jobEducation.push({_id: newEducation._id, level: newEducation.level, field: newEducation.field});
                }

                for (var j=0;j < currentJob.competence.length; j++){
                    const newCompetence= await Competence.findById(currentJob.competence[j]);
                    jobCompetence.push({_id: newCompetence._id, skill: newCompetence.sklill, level: newCompetence.level});
                }

                var match = algorithm.match(jobEducation, jobSeekerEducation, jobCompetence, jobSeekerCompetence);
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
                        competence: jobCompetence,
                        description: currentJob.description
                    }
                });
            }

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
                    education: getEducationList.bind(this, jobs._doc.education),
                    competence: getCompetenceList.bind(this, jobs._doc.competence)


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
    },

    createCompetence: (args) => {
        const competence = new Competence({
                skill: args.competenceInput.skill,
                level: args.competenceInput.level
            }
        );
        return  competence.save().then(result => {
            console.log(result);
            return {...result._doc};
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    acceptJob: async (args) => {
        var currUser = null;
        var currJobSeeker = null;
        var currJob = null;
        try{
            currUser = await User.findById(args.acceptJobInput.userId);
            currJobSeeker = await JobSeeker.findById(currUser.jobSeeker);
            currJob = await Job.findById(args.acceptJobInput.jobId);
        }
        catch (err) {
            throw err;
        }

        if (currJobSeeker.completeJobMatch.includes(args.acceptJobInput.jobId) === false){
            if (currJob.jobSeekerInterest.includes(args.acceptJobInput.userId) === false && currJob.companyInterest.includes(args.acceptJobInput.userId) === false){
                try{
                    currJob.jobSeekerInterest.push(args.acceptJobInput.userId);
                    var updatedJob = await Job.findByIdAndUpdate(args.acceptJobInput.jobId, { jobSeekerInterest: currJob.jobSeekerInterest});
                }
                catch (err) {
                    throw err;
                }

                return "1 Way Match";

            }
            else if (currJob.companyInterest.includes(args.acceptJobInput.userId)){
                //Remove user id from companyInterest
                if (currJob.companyInterest.length == 1){
                    currJob.companyInterest = [];
                }
                else{
                    for( var i = 0; i < currJob.companyInterest.length; i++){
                        if ( currJob.companyInterest[i] === args.acceptJobInput.userId) {
                            currJob.companyInterest.splice(i, 1);
                        }
                    }
                }

                //Add job to complete match list
                currJobSeeker.completeJobMatch.push(args.acceptJobInput.jobId);

                //Update mongo db values
                try{
                    var updatedJob = await Job.findByIdAndUpdate(args.acceptJobInput.jobId, { companyInterest: currJob.companyInterest});
                    var updatedJobSeeker = await JobSeeker.findByIdAndUpdate(currJobSeeker.id, { completeJobMatch: currJobSeeker.completeJobMatch});
                }
                catch (err) {
                    throw err;
                }


                return "Complete Match";
            }
            else{
                return "Already 1 Way Match";

            }
        }
        else {
            return "Already Complete Match"
        }



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


