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
    password: String!
    company: Company
    jobSeeker: JobSeeker
    isCompany: Boolean!
    isAdmin: Boolean!
    profilePictureUrl: String!
  }
  
  type JobSeeker {
    _id: ID!
    name: String!
    phone: String!
    education: [Education!]
    competence: [Competence!]
    location: String!
    typeofwork: Int
    salary: Int
    education_p: Float!
    competence_p: Float!
    location_p: Float!
    typeofwork_p: Float!
    salary_p: Float!
    completeJobMatch: [Job!]
  }
  
  type Job {
    _id: ID!
    name: String!
    company: Company
    education: [Education!]
    competence: [Competence!]
    location: String!
    typeofwork: Int
    salary: Int
    description: String!
    jobSeekerInterest: [User!]
    companyInterest: [User!]
    completeJobSeekerMatch: [User!]
  }
  
  type Company {
    _id: ID!
    name: String!
    phone: String!
    email: String!
    logoUrl: String!
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
    education: [ID!]
    competence: [ID!]
    location: String!
    typeofwork: Int
    salary: Int
    education_p: Float!
    competence_p: Float!
    location_p: Float!
    typeofwork_p: Float!
    salary_p: Float!
  }
  
  input UserInput {
    email: String
    password: String!
    profilePictureUrl: String!
  }
  
  input JobInput {
    name: String!
    company: ID!
    education: [ID!]
    competence: [ID!]
    location: String!
    typeofwork: Int
    salary: Int
    description: String!
  }
  
  input CompanyInput{
    name: String!
    phone: String!
    email: String!
    logoUrl: String
  }
  
  input EducationInput {
    level: String!
    field: String!
  }
  input CompetenceInput {
    skill: String!
    level: String!
  }
  
  input AcceptInput {
    userId: String!
    jobId: String!
  }
  
  
  type Query {
    users: [User!]!
    jobs: [Job!]!
    companies: [Company!]!
    jobSeekerMatch(jobSeekerUserId: String!): [JobSeekerMatch]
    jobMatch(jobId: String!): [JobMatch]
    jobSeekerCompleteMatches (jobSeekerUserId: String!) : [Job]
    jobCompleteMatches (companyUserId: String!) : [Job]
    checkUser(email: String!, password: String!): User
    competence: [Competence!]!
    education: [Education!]!
  }
  type Mutation {
    createJobSeeker(jobSeekerInput: JobSeekerInput, userInput: UserInput): User
    createJob(jobInput: JobInput): Job
    createCompany(companyInput: CompanyInput, userInput: UserInput): User
    createEducation(educationInput: EducationInput): Education
    createCompetence(competenceInput: CompetenceInput): Competence
    acceptJob(acceptInput: AcceptInput): String
    acceptJobSeeker(acceptInput: AcceptInput): String
    deleteJob(jobId: String): Boolean
    deleteUser(userId: String): Boolean
    updateJob(jobId: String, jobInput: JobInput): Job
    updateJobSeeker(jobSeekerUserId: String, jobSeekerInput: JobSeekerInput): JobSeeker
    updateCompany(companyUserId: String, companyInput: CompanyInput): Company
    updateUser(userId: String, userInput: UserInput): User
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

const getJobSeekerUserList =  userIds => {
    return User.find({_id: { $in: userIds } })
        .then( users => {
            return users.map(user => {
                return{
                    ...user._doc,
                    _id: user.id,
                    jobSeeker: getJobSeeker.bind(this, user._doc.jobSeeker)

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
                if (!jobSeeker) {
                    return null;
                }

                return {
                    ...jobSeeker._doc,
                    _id: jobSeeker.id,
                    education: getEducationList.bind(this, jobSeeker._doc.education),
                    competence: getCompetenceList.bind(this, jobSeeker._doc.competence)
                }
            })
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
    competence: () => {
        return Competence.find().then(competences => {
            return competences.map(competences => {
                return {
                    ...competences._doc,
                    _id: competences._doc._id.toString(),
                };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    education: () => {
        return Education.find().then(educations => {
            return educations.map(educations => {
                return {
                    ...educations._doc,
                    _id: educations._doc._id.toString(),
                };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    jobCompleteMatches: async (args) => {
        var currUser = null;
        try {
            currUser = await User.findById(args.companyUserId);
        }
        catch (err) {
            throw err;
        }
        return Job.find({company: currUser.company, completeJobSeekerMatch: { $exists: true, $ne: [] } }).then(jobs => {
            return jobs.map(jobs => {
                return {
                    ...jobs._doc,
                    _id: jobs._doc._id.toString(),
                    company: getCompany.bind(this, jobs._doc.company),
                    education: getEducationList.bind(this, jobs._doc.education),
                    competence: getCompetenceList.bind(this, jobs._doc.competence),
                    completeJobSeekerMatch: getJobSeekerUserList.bind(this, jobs._doc.completeJobSeekerMatch)

                };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });


    },
    jobSeekerCompleteMatches: async (args) => {
        var currUser = null;
        var currJobSeeker = null;
        try {
            currUser = await User.findById(args.jobSeekerUserId);
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
        const job = await Job.findById(args.jobId);

        try {

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
            const users = await User.find({isCompany: false, isAdmin: false});


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
                if (job.completeJobSeekerMatch.includes(currentUser._id) === false) {
                    var match = await algorithm.match(jobEducation, userEducation,
                        jobCompetence, userCompetence,
                        currentJobSeeker.location, job.location,
                        currentJobSeeker.typeofwork, job.typeofwork,
                        currentJobSeeker.salary, job.salary,
                        currentJobSeeker.education_p,
                        currentJobSeeker.competence_p,
                        currentJobSeeker.location_p,
                        currentJobSeeker.typeofwork_p,
                        currentJobSeeker.salary_p);
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
                                competence: userCompetence,
                                location: currentJobSeeker.location,
                                typeofwork: currentJobSeeker.typeofwork,
                                salary: currentJobSeeker.salary
                            },
                            isCompany: currentUser.isCompany,
                            isAdmin: currentUser.isAdmin,
                            profilePictureUrl: currentUser.profilePictureUrl
                        }
                    });
                }
            }

        } catch (err) {
            throw err;
        }
        return matches;
    },
    jobSeekerMatch: async (args) => {
        const jobSeekerEducation = [];
        const jobSeekerCompetence = [];
        const user = await User.findById(args.jobSeekerUserId);
        const jobSeeker = await JobSeeker.findById(user.jobSeeker);
        const matches = []

        try {


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
                    jobCompetence.push({_id: newCompetence._id, skill: newCompetence.skill, level: newCompetence.level});
                }
                if (currentJob.completeJobSeekerMatch.includes(args.jobSeekerUserId) === false) {
                    var match = await algorithm.match(jobEducation, jobSeekerEducation,
                        jobCompetence, jobSeekerCompetence,
                        currentJob.location, jobSeeker.location,
                        currentJob.typeofwork, jobSeeker.typeofwork,
                        currentJob.salary, jobSeeker.salary,
                        jobSeeker.education_p,
                        jobSeeker.competence_p,
                        jobSeeker.location_p,
                        jobSeeker.typeofwork_p,
                        jobSeeker.salary_p);
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
                            location: currentJob.location,
                            typeofwork: currentJob.typeofwork,
                            salary: currentJob.salary,
                            education: jobEducation,
                            competence: jobCompetence,
                            description: currentJob.description
                        }
                    });
                }
                else {

                }
            }

        } catch (err) {
            throw err;
        }
        return matches;
    },
    users: () => {
        return User.find({isAdmin: false}).then(users => {
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
    checkUser: (args) => {
        const lowercaseEmail = args.email.toLowerCase();
        return User.findOne({email : lowercaseEmail ,password : args.password}).then(users => {
            return {
                ...users._doc,
                _id: users._doc._id.toString(),
                company: getCompany.bind(this, users._doc.company),
                jobSeeker: getJobSeeker.bind(this, users._doc.jobSeeker)
            }
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },createJobSeeker: async (args) => {
        var newjobSeeker = null;
        const thisEmail = args.userInput.email.toLowerCase();
        const password = args.userInput.password;
        try{
            const user = await User.find({email : thisEmail})
            console.log("user:"+ user)

            if(user != ""){
                return null;
            }

        }catch (err) {
            throw err;
        }
        try {
            const jobSeeker = new JobSeeker({
                    name: args.jobSeekerInput.name,
                    phone: args.jobSeekerInput.phone,
                    education: args.jobSeekerInput.education,
                    competence: args.jobSeekerInput.competence,
                    location: args.jobSeekerInput.location,
                    typeofwork: args.jobSeekerInput.typeofwork,
                    salary: args.jobSeekerInput.salary,
                    education_p: args.jobSeekerInput.education_p,
                    competence_p: args.jobSeekerInput.competence_p,
                    location_p: args.jobSeekerInput.location_p,
                    typeofwork_p: args.jobSeekerInput.typeofwork_p,
                    salary_p: args.jobSeekerInput.salary_p,
                    completeJobMatch: []
                }
            );
            newjobSeeker = jobSeeker;
            jobSeeker.save().then(result => {
                console.log(result);
            })
        }
        catch (err) {
            throw err;
        }
        try {
            const user = new User({
                    email: thisEmail,
                    password: password,
                    company: null,
                    jobSeeker: newjobSeeker._id,
                    isCompany: false,
                    isAdmin: false,
                    profilePictureUrl: args.userInput.profilePictureUrl


                }
            );
            return user.save().then(result => {
                console.log(result);
                return {
                    ...result._doc,
                    jobSeeker: getJobSeeker.bind(this, result._doc.jobSeeker)
                };
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }catch (err) {
            throw err;
        }
    },
    createJob: (args) => {
        const job = new Job({
                name: args.jobInput.name,
                company: args.jobInput.company,
                education: args.jobInput.education,
                competence:  args.jobInput.competence,
                location:  args.jobInput.location,
                typeofwork:  args.jobInput.typeofwork,
                description: args.jobInput.description,
                salary:  args.jobInput.salary
            }
        );
        return job.save().then(result => {
            console.log(result);
            return {
                ...result._doc,
                company: getCompany.bind(this, result._doc.company)
            };
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createCompany: async (args) => {
        var newCompany = null;
        const password = args.userInput.password;
        const thisEmail = args.userInput.email.toLowerCase();
        try{
            const user = await User.find({email: thisEmail})
            console.log("user:" + user)

            if (user != "") {
                return null;
            }
        }   catch (err) {
            throw err;
        }
        try {
            const company = new Company({
                    name: args.companyInput.name,
                    phone: args.companyInput.phone,
                    email: args.companyInput.email,
                    logoUrl: args.companyInput.logoUrl
                }
            );
            newCompany = company;
            company.save().then(result => {
                console.log(result);
            })
        }
        catch (err) {
            throw err;
        }
        try {
            const user = new User({
                    email: thisEmail,
                    company: newCompany._id,
                    password: password,
                    jobSeeker: null,
                    isCompany: true,
                    isAdmin: false,
                    profilePictureUrl: args.userInput.profilePictureUrl

                }
            );
            return user.save().then(result => {
                console.log(result);
                return {
                    ...result._doc,
                    company: getCompany.bind(this, result._doc.company)
                };
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }catch (err) {
            throw err;
        }
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
            currUser = await User.findById(args.acceptInput.userId);
            currJobSeeker = await JobSeeker.findById(currUser.jobSeeker);
            currJob = await Job.findById(args.acceptInput.jobId);
        }
        catch (err) {
            throw err;
        }

        if (currJobSeeker.completeJobMatch.includes(args.acceptInput.jobId) === false){
            if (currJob.jobSeekerInterest.includes(args.acceptInput.userId) === false && currJob.companyInterest.includes(args.acceptInput.userId) === false){
                try{
                    currJob.jobSeekerInterest.push(args.acceptInput.userId);
                    var updatedJob = await Job.findByIdAndUpdate(args.acceptInput.jobId, { jobSeekerInterest: currJob.jobSeekerInterest});
                }
                catch (err) {
                    throw err;
                }

                return "1 Way Match";

            }
            else if (currJob.companyInterest.includes(args.acceptInput.userId)){
                //Remove user id from companyInterest
                if (currJob.companyInterest.length == 1){
                    currJob.companyInterest = [];
                }
                else{
                    for( var i = 0; i < currJob.companyInterest.length; i++){
                        if ( currJob.companyInterest[i] === args.acceptInput.userId) {
                            currJob.companyInterest.splice(i, 1);
                        }
                    }
                }

                //Add job to complete match list
                currJobSeeker.completeJobMatch.push(args.acceptInput.jobId);
                currJob.completeJobSeekerMatch.push(args.acceptInput.userId);

                //Update mongo db values
                try{
                    var updatedJob = await Job.findByIdAndUpdate(args.acceptInput.jobId, { companyInterest: currJob.companyInterest, completeJobSeekerMatch: currJob.completeJobSeekerMatch});
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



    },
    acceptJobSeeker: async (args) => {
        var currUser = null;
        var currJobSeeker = null;
        var currJob = null;
        try {
            currUser = await User.findById(args.acceptInput.userId);
            currJobSeeker = await JobSeeker.findById(currUser.jobSeeker);
            currJob = await Job.findById(args.acceptInput.jobId);
        } catch (err) {
            throw err;
        }

        if (currJob.completeJobSeekerMatch.includes(args.acceptInput.userId) === false) {
            if (currJob.jobSeekerInterest.includes(args.acceptInput.userId) === false && currJob.companyInterest.includes(args.acceptInput.userId) === false) {
                try {
                    currJob.companyInterest.push(args.acceptInput.userId);
                    var updatedJob = await Job.findByIdAndUpdate(args.acceptInput.jobId, {companyInterest: currJob.companyInterest});
                } catch (err) {
                    throw err;
                }

                return "1 Way Match";

            } else if (currJob.jobSeekerInterest.includes(args.acceptInput.userId)) {
                //Remove user id from companyInterest
                if (currJob.jobSeekerInterest.length == 1) {
                    currJob.jobSeekerInterest = [];
                } else {
                    for (var i = 0; i < currJob.jobSeekerInterest.length; i++) {
                        if (currJob.jobSeekerInterest[i] === args.acceptInput.userId) {
                            currJob.jobSeekerInterest.splice(i, 1);
                        }
                    }
                }

                //Add job to complete match list
                currJob.completeJobSeekerMatch.push(args.acceptInput.userId);
                currJobSeeker.completeJobMatch.push(args.acceptInput.jobId);

                //Update mongo db values
                try {
                    var updatedJob = await Job.findByIdAndUpdate(args.acceptInput.jobId, {jobSeekerInterest: currJob.jobSeekerInterest, completeJobSeekerMatch: currJob.completeJobSeekerMatch});
                    var updatedJobSeeker = await JobSeeker.findByIdAndUpdate(currJobSeeker.id, {completeJobMatch: currJobSeeker.completeJobMatch});
                } catch (err) {
                    throw err;
                }


                return "Complete Match";
            } else {
                return "Already 1 Way Match";

            }
        } else {
            return "Already Complete Match"
        }

    },
    deleteJob: async (args) => {
        try {
            currJob = await Job.findByIdAndRemove(args.jobId);
        }
        catch (err) {

        }
        if (currJob == null){
            return false;
        }
        else{
            return true;
        }


    },
    deleteUser: async (args) => {
        try {
            currUser = await User.findById(args.userId);
            if (currUser.isAdmin === false){
                //Job Seeker
                if (currUser.isCompany === false){
                    const jobs = await Job.find({});

                    for (var i=0;i < jobs.length; i++) {

                        //Check if user has shown interest in a job and removes the user from the array if true
                        if (jobs[i].jobSeekerInterest.includes(args.userId)) {
                            //Remove user id from jobSeekerInterest
                            if (jobs[i].jobSeekerInterest.length !== 1) {
                                for (var j = 0; j < jobs[j].jobSeekerInterest.length; j++) {
                                    if (jobs[i].jobSeekerInterest[j] === args.userId) {
                                        jobs[i].jobSeekerInterest.splice(j, 1);
                                    }
                                }
                            } else {
                                jobs[i].jobSeekerInterest = [];
                            }
                        }

                        //Check if company has shown interest in the user and removes the user from the array if true
                        if (jobs[i].companyInterest.includes(args.userId)) {
                            //Remove user id from companyInterest
                            if (jobs[i].companyInterest.length !== 1) {
                                for (var j = 0; j < jobs[j].companyInterest.length; j++) {
                                    if (jobs[i].companyInterest[j] === args.userId) {
                                        jobs[i].companyInterest.splice(j, 1);
                                    }
                                }
                            } else {
                                jobs[i].companyInterest = [];
                            }
                        }

                        //Check if user is in a completeMatch and removes if true
                        if (jobs[i].completeJobSeekerMatch.includes(args.userId)) {
                            //Remove user id from completeJobSeekerMatch
                            if (jobs[i].completeJobSeekerMatch.length !== 1) {
                                for (var j = 0; j < jobs[j].completeJobSeekerMatch.length; j++) {
                                    if (jobs[i].completeJobSeekerMatch[j] === args.userId) {
                                        jobs[i].completeJobSeekerMatch.splice(j, 1);
                                    }
                                }
                            } else {
                                jobs[i].completeJobSeekerMatch = [];
                            }
                        }

                        //Update Job
                        var updatedJob = await Job.findByIdAndUpdate(jobs[i]._id, {jobSeekerInterest: jobs[i].jobSeekerInterest, companyInterest: jobs[i].companyInterest, completeJobSeekerMatch: jobs[i].completeJobSeekerMatch});

                    }

                    //Delete jobSeeker
                    var deletedJobSeeker = await JobSeeker.findByIdAndRemove(currUser.jobSeeker);
                    //Delete user
                    var deletedUser = await User.findByIdAndRemove(args.userId);
                    //Return true to indicate deletion
                    return true;
                }
                //Company
                else{
                    //Delete user
                    var deletedUser = await User.findByIdAndRemove(args.userId);
                    return true;
                }

            }
            //Admin
            else{
                //Cannot delete admin so return false
                return false;
            }
        }
        catch (err) {
            return false;
        }


    },
    updateJob: async (args) => {
        return Job.findByIdAndUpdate(
            args.jobId,
            {
                name: args.jobInput.name,
                company: args.jobInput.company,
                education: args.jobInput.education,
                competence: args.jobInput.competence,
                location: args.jobInput.location,
                typeofwork: args.jobInput.typeofwork,
                salary: args.jobInput.salary,
                description: args.jobInput.description
            },
            {
                new: true
            }).then(result => {
            console.log(result);
            return {
                ...result._doc,
                _id: result._doc._id.toString(),
                company: getCompany.bind(this, result._doc.company),
                education: getEducationList.bind(this, result._doc.education),
                competence: getCompetenceList.bind(this, result._doc.competence)
            };
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    updateJobSeeker: async (args) => {
        try {
            currUser = await User.findById(args.jobSeekerUserId);
        } catch (err) {
            throw err;
        }
        return JobSeeker.findByIdAndUpdate(
            currUser.jobSeeker,
            {
                name: args.jobSeekerInput.name,
                phone: args.jobSeekerInput.phone,
                company: args.jobSeekerInput.company,
                education: args.jobSeekerInput.education,
                competence: args.jobSeekerInput.competence,
                location: args.jobSeekerInput.location,
                typeofwork: args.jobSeekerInput.typeofwork,
                salary: args.jobSeekerInput.salary,
                education_p: args.jobSeekerInput.education_p,
                competence_p: args.jobSeekerInput.competence_p,
                location_p: args.jobSeekerInput.location_p,
                typeofwork_p: args.jobSeekerInput.typeofwork_p,
                salary_p: args.jobSeekerInput.salary_p
            },
            {
                new: true
            }).then(result => {
            console.log(result);
            return {
                ...result._doc,
                _id: result._doc._id.toString(),
                education: getEducationList.bind(this, result._doc.education),
                competence: getCompetenceList.bind(this, result._doc.competence)
            };
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    updateCompany: async (args) => {
        try {
            currUser = await User.findById(args.companyUserId);
        } catch (err) {
            throw err;
        }
        return Company.findByIdAndUpdate(
            currUser.company,
            {
                name: args.companyInput.name,
                phone: args.companyInput.phone,
                email: args.companyInput.email,
                logoUrl: args.companyInput.logoUrl,
            },
            {
                new: true
            }).then(result => {
            console.log(result);
            return {
                ...result._doc,
                _id: result._doc._id.toString()
            };
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    updateUser: async (args) => {
        return User.findByIdAndUpdate(
            args.userId,
            {
                email: args.userInput.email,
                password: args.userInput.password,
                profilePictureUrl: args.userInput.profilePictureUrl
            },
            {
                new: true
            }).then(result => {
            console.log(result);
            return {
                ...result._doc,
                _id: result._doc._id.toString(),
                company: getCompany.bind(this, result._doc.company),
                jobSeeker: getJobSeeker.bind(this, result._doc.jobSeeker)
            };
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
