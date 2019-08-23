const jobRequirements = [
    {
        "level": "Master",
        "field": "Information Technology"
    },
 
    ];
const ApplicatesDegree = [
{
    "level": "Master",
    "field": "Information Technology"
},

];
var DegreeScore= 0;
console.log(jobRequirements.length);
for (var i=0;i < jobRequirements.length; i++)
{for(var j=0; j < ApplicatesDegree.length; j++)
    {if(jobRequirements[i].level == ApplicatesDegree[j].level)
            {if(jobRequirements[i].field == ApplicatesDegree[j].field)  
            {DegreeScore =DegreeScore +1; 

            }
            }
    }
}
var alljRequrimentDegrees = jobRequirements.length;
var FinalDegreeScore = alljRequrimentDegrees/DegreeScore;
if (FinalDegreeScore == 1)
{
    console.log("The Application meets all degree requirments");
    totalScore = FinalDegreeScore;  
    console.log(totalScore*100+"%");

}
else{
    console.log("The Application does not meet all degree requirments");
    totalScore = (DegreeScore/alljRequrimentDegrees); 
    console.log(totalScore*100+"%");
}

