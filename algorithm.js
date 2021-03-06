const degree = require('./degree.js');
const competence = require('./competence.js');
const location = require('./location.js');
const typeofwork = require('./typeofwork.js');
const salary = require('./salary.js');

const match = async function(jobRequirements, ApplicatesDegree,
                        jobComptence, ApplicatesCompetence,
                        applicatianlocation,joblocation,
                        applicatiantypeofwork, jobtypeofwork,
                        applcatiantsalary, jobsalary,
                        educationPriority,
                        competencePriority,
                        locationPriority,
                        workPriority,
                        salaryPriority) {


var locationScore = (await location.locationMatch(applicatianlocation,joblocation)*locationPriority);    
var degreeScore = (degree.degreeMatch(jobRequirements, ApplicatesDegree)*educationPriority);
var skillScore = (competence.skillMatch(jobComptence, ApplicatesCompetence)*competencePriority);
var workScore = (typeofwork.workMatch(applicatiantypeofwork, jobtypeofwork)*workPriority);
var salaryScore = (salary.salaryMatch(applcatiantsalary, jobsalary)*salaryPriority);   



    totalScore =  skillScore + degreeScore + locationScore + salaryScore + workScore;
    return totalScore;
    

}

module.exports = {
    match: match,
}

