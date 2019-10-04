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

    else if(jobtypeofwork == 3)
    {if(applicatiantypeofwork == 1 || applicatiantypeofwork == 2)
        {
            workScore  = workScore + 1;
        }

    }
    else if(jobtypeofwork == 4)
    {if(applicatiantypeofwork == 5 || applicatiantypeofwork == 7 || applicatiantypeofwork == 6)
        {
            workScore = workScore + 1;
        }

    }

    else if(jobtypeofwork == 5)
    {if(applicatiantypeofwork == 4 || applicatiantypeofwork == 1)
        {
            workScore  = workScore + 1;
        }
    }

    else if(jobtypeofwork == 6)
    {if(applicatiantypeofwork == 4 || applicatiantypeofwork == 2)
        {
            workScore  = workScore + 1;
        }
    }

    else if(jobtypeofwork == 7)
    {
            workScore  = workScore + 1;
        }



return workScore;
}


module.exports = 
{
    workMatch: workMatch,
}
    