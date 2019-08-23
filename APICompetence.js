const jobComptence = [
    {
        "skill": "JavaScript",
        "level": "Expert"
    },
    {
        "skill": "Python",
        "level": "Basic"
    }
    ];
const ApplicatesCompetence= [
    {
        "skill": "JavaScript",
        "level": "Expert"
    },
    {
        "skill": "Python",
        "level": "Expert"
    }
    ];
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
var alljRequrimentDegrees = (jobComptence.length)*2;
var FinalDegreeScore = alljRequrimentDegrees/competenceScore;
if (FinalDegreeScore == 1)
{
    console.log("The Application meets all degree requirments");
    totalScore = FinalDegreeScore;  
    console.log(totalScore*100+"%");

}
else{
    console.log("The Application does not meet all degree requirments");
    totalScore = (competenceScore/alljRequrimentDegrees); 
    console.log(totalScore*100+"%");
}

