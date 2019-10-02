const salaryMatch = function(applcatiantsalary, jobsalary)
{

var salaryScore = 0;

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

    return salaryScore;
}

module.exports = 
{
    salaryMatch: salaryMatch,
}
    