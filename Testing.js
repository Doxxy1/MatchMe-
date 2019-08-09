var a = [
  'Analytical ',
  'Communication ',
  '5'
 ];
 
 var b = [
   'Analytical ',
   'Communication ',
   '5'
   
 ];
 
 var JobSkillLength = a.length;
 var SearchersSkills = 0;
 
 
 for (var i=0;i < b.length; i++){
     //console.log(b[i]);
     var n = a.includes(b[i]);
     if(n == true)
     {
       //console.log("Added")
       SearchersSkills = SearchersSkills +1;
     }
  }
 console.log("The application has: " +SearchersSkills+ " skills associate with the job");
 var Score = SearchersSkills/JobSkillLength;
 
 console.log("The compatibility score of the job to application is "+Score);
 
 
 //console.log(
  //   jaccard.index(a, b)
   //);