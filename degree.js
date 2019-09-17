
const degreeMatch = function(jobRequirements, ApplicatesDegree)
{

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
return totalDegreeScore;
}

module.exports = {
    degreeMatch: degreeMatch,
}
