
const skillMatch = function(jobComptence, ApplicatesCompetence)
{
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
    return totalComptenceScore;
} 
module.exports = 
{
        skillMatch: skillMatch,
}
    