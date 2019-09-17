const workMatch = function(applicatiantypeofwork, jobtypeofwork)
{
    var workScore = 0;
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
return finalworkscore;
}

module.exports = 
{
    workMatch: workMatch,
}
    