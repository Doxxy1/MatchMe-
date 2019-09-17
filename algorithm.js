const degree = require('./degree.js');
const competence = require('./competence.js');
const location = require('./location.js');
const typeofwork = require('./typeofwork.js');
const salary = require('./salary.js');

const match = function(jobRequirements, ApplicatesDegree,
                        jobComptence, ApplicatesCompetence,
                        applicatianlocation,joblocation,
                        applicatiantypeofwork, jobtypeofwork,
                        applcatiantsalary, jobsalary) {

    
var degreeScore = degree.degreeMatch(jobRequirements, ApplicatesDegree);
var skillScore = competence.skillMatch(jobComptence, ApplicatesCompetence);
var locationScore = location.locationMatch(applicatianlocation,joblocation);
var workScore = typeofwork.workMatch(applicatiantypeofwork, jobtypeofwork);
var salaryScore = salary.salaryMatch(applcatiantsalary, jobsalary);   

totalScore =  skillScore + degreeScore + locationScore + salaryScore + workScore;
    
    return totalScore;
}

module.exports = {
    match: match,
}

