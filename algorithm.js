const match = function(jobRequirements, ApplicatesDegree,
                        jobComptence, ApplicatesCompetence,
                        applicatianlocation,joblocation,
                        applicatiantypeofwork, jobtypeofwork,
                        applcatiantsalary, jobsalary) {

    var DegreeScore= 0;

    for (var i=0;i < jobRequirements.length; i++)
    {
        for(var j=0; j < ApplicatesDegree.length; j++)
        {
            if(jobRequirements[i].level == ApplicatesDegree[j].level)
            {
                if(jobRequirements[i].field == ApplicatesDegree[j].field)
                {
                    DegreeScore =DegreeScore +1 ;
                }
            }
        }
    }

    var alljRequrimentDegrees = jobRequirements.length;
    var FinalDegreeScore = alljRequrimentDegrees/DegreeScore;
    if (FinalDegreeScore == 1)
    {
        // console.log("The Application meets all degree requirments");
        totalDegreeScore = FinalDegreeScore;

    }
    else{
        // console.log("The Application does not meet all degree requirments");
        totalDegreeScore = (DegreeScore/alljRequrimentDegrees);
    }

    //half the score as we are doing the wieghting of 50/50

    //as we now have 5 fields this will be weighted by 20% per each field
    totalDegreeScore = totalDegreeScore/5;

    var competenceScore = 0;
    for (var i=0;i < jobComptence.length; i++)
    {for(var j=0; j < ApplicatesCompetence.length; j++)
        {if(jobComptence[i].skill == ApplicatesCompetence[j].skill)
            competenceScore = competenceScore+1;
            {if(jobComptence[i].level == ApplicatesCompetence[j].level)  
                {competenceScore = competenceScore+1}
                else if(jobComptence != ApplicatesCompetence)
                    {
                    if(ApplicatesCompetence == "Intermediate")
                        {if(jobComptence == "Basic"){
                            competenceScore = competenceScore+1;}
                        }
                    if(ApplicatesCompetence =="Advanced")
                        {if(jobComptence =="Basic" || jobComptence =="Intermediate"){
                            competenceScore = competenceScore+1;}
                        }
                    if(ApplicatesCompetence =="Expert")
                        {if(jobComptence =="Basic" || jobComptence =="Intermediate" ||  jobComptence=="Advanced")
                        {   competenceScore = competenceScore+1;}
                        }
                    }
            }
    
        }
    }
    var alljRequrimentCompetence = (jobComptence.length)*2;

    var locationScore = 0;
    var salaryScore = 0;
    var workScore = 0;

//Location Score 
    if(applicatianlocation == joblocation)
    {
        locationScore  = locationScore + 1;
    }

    var finallocation = locationScore/5;
    

//Typeofwork Score 
    if(applicatiantypeofwork == jobtypeofwork )
    {
       workScore = workScore +1 
    }

    else if(jobtypeofwork == 1)
    {if(applicatiantypeofwork == 3 || applicatiantypeofwork == 5 || applicatiantypeofwork == 7)
        {
            workScore  = workScore + 1;
        }
    }
    else if(jobtypeofwork == 2)
    {if(applicatiantypeofwork == 3 || applicatiantypeofwork == 6 || applicatiantypeofwork == 7)
        {
            workScore  = workScore + 1;
        }

    }
    else if(jobtypeofwork == 4)
    {if(applicatiantypeofwork >4)
        {
            workScore = workScore + 1;
        }

    }
    var finalworkscore = workScore/5;


//salaryScore 
/*10% under we are still happy with 90%
20% under we are sad with a 70%
30% under we are sad with a 60%
40% under we are sad with a 50%... etc*/
    if(applcatiantsalary <= jobsalary)
    {
        salaryScore = salaryScore +1;
    }
    else
    {
        var percentage = jobsalary/applcatiantsalary;
        salaryScore = percentage;
    }

    var finalsalaryScore = salaryScore/5;


    var FinalComptenceScore = alljRequrimentCompetence/competenceScore;
    if (FinalComptenceScore == 1)
    {
        console.log("The Application meets all Skill requirments");
        totalComptenceScore = FinalComptenceScore;  
      
    
    }
    else{
        console.log("The Application does not meet all skill requirments");
        totalComptenceScore = (competenceScore/alljRequrimentCompetence); 
    }
    totalComptenceScore = totalComptenceScore /5;
    totalScore =  totalComptenceScore + totalDegreeScore + finallocation + finalsalaryScore + finalworkscore;
    
    return totalScore;
}

module.exports = {
    match: match,
}

