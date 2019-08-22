const match = function(jRequrimentDegree, aDegree) {

    var totalScore = 0;
    var DegreeScore = 0;
//    var competenceScore = 0;

    for (var [key1, value1] of jRequrimentDegree) {
        for (var [key2, value2] of aDegree) {
            if (key1 == key2) {
                if (value1 == value2) {
                    DegreeScore = DegreeScore + 1;
                }
            }
        }

    }
    var alljRequrimentDegrees = jRequrimentDegree.size;
    var FinalDegreeScore = alljRequrimentDegrees / DegreeScore;
    if (FinalDegreeScore == 1) {
        console.log("The Application meets all degree requirments");
        totalScore = FinalDegreeScore / 2;
    } else {
        console.log("The Application does not meet all degree requirments");
        totalScore = (DegreeScore / alljRequrimentDegrees) / 2;
    }
    return totalScore;
}

module.exports = {
    match: match,
}

// User adds education -> Check the edu table-> If exists fetch id if empty create new and save id

// var jRequrimentDegree = new Map ([1 , ['Bachelor','Information Technology'], ['2 Bachelor','Arts'  ]]);

// value[0]  -> Edu Level
// value[1] -> Edu Field

//Competence functionality will come second
/*
for (var [key3, value3] of jRequrimentCompetence) {
    for (var [key4, value4] of aCompetence){
        if (key3 == key4)
        {
            competenceScore = competenceScore+1;
            if(value3 == value4)
            {
                competenceScore = competenceScore+1;
            }
            else if(value3 != value4)
            {
                if(value4 == "Intermediate")
                {if(value3 == "Basic"){
                    competenceScore = competenceScore+1;}
                }
                if(value4 =="Advanced")
                {if(value3 =="Basic" || value3 =="Intermediate"){
                    competenceScore = competenceScore+1;}
                }
                if(value4 =="Expert")
                {if(value3 =="Basic" || value3 =="Intermediate" ||  value3=="Advanced")
                {   competenceScore = competenceScore+1;}
                }
            }
        }
    }
}
var alljRequrimentcompetences = (jRequrimentCompetence.size)*2;
var FinalCompetenceScore = competenceScore/alljRequrimentcompetences;
totalScore = totalScore + FinalCompetenceScore/2;

}
*/
