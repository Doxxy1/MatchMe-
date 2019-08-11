
//array    
var jRequrimentDegree = [

'Information Technology'

 ];

//Map
var jRequrimentCompetence = new Map([["JavaScript" , "Expert"],
                                     ["Python" ,"Basic" ]]); 

 var aDegree = [
    'Information Technology'
 ]

 var aCompetence = new Map([["JavaScript" , "Basic"],
                            ["Python" ,"Basic" ]]); 


 var DegreeScore= 0;
 //Category Checking
    //Degree
 for (var i=0;i < jRequrimentDegree.length; i++)
 {
    var DegreeCheck = aDegree.includes(jRequrimentDegree[i]);
    if (DegreeCheck == true)
    {
        DegreeScore =DegreeScore +1 ;
 }
}

var alljRequrimentDegrees = jRequrimentDegree.length;
var FinalDegreeScore = alljRequrimentDegrees/DegreeScore;
if (FinalDegreeScore == 1)
{
    console.log("The Application meets all degree requirments");

}
else{
    console.log("The Application does not meet all degree requirments");

}


    //Competence 


 