const locationMatch = function(applicatianlocation,joblocation)
{
    var locationScore = 0;
    console.log("I was called")
    var distance = require('google-distance-matrix');
    var origins = [joblocation];
    var destinations = [applicatianlocation];
    distance.key('AIzaSyAvEJ0_IbB0kgEJvbKIsHZuzVTNO3QMTFo');
    console.log("I was called2")

    distance.matrix(origins, destinations, function (err, distances) {
        console.log("I was called3")

        if (err) {
            return 0;
        }
        if(!distances) {
            return console.log('no distances');
        }
        if (distances.status == 'OK') {
            for (var i=0; i < origins.length; i++) {
                for (var j = 0; j < destinations.length; j++) {
                    var origin = distances.origin_addresses[i];
                    var destination = distances.destination_addresses[j];
                    if (distances.rows[0].elements[j].status == 'OK')
                     {
                        var distanceS = distances.rows[i].elements[j].distance.text;
                        var distance = parseInt(distanceS, 10);
                        console.log("Test 2")
                        if(origin == destination)
                        {
                           var locationScore  =  1;
                            
                            console.log("Good match" + locationScore)
                            return locationScore;

                        }
                        else if(distance <=20) 
                        {
                            console.log("<20")

                            var locationScore  = locationScore + 1;
                            return locationScore;
                        }
                        else if(distance <=30)
                        {
                            console.log("<30")

                          var   locationScore  = locationScore + .8;
                            return locationScore;

                        }
                        else if(distance <=50)
                        {
                          var   locationScore  = locationScore + .6;
                            return locationScore;

                        }
                        else if(distance <=70)
                        {
                           var locationScore  = locationScore + .4;
                            return locationScore;

                        }
                        else if(distance >70)
                        {
                            var locationScore  =  0;
                            return locationScore;

                        }

                    } else {
                        console.log(destination + ' is not reachable by land from ' + origin);
                    }
                }
            }
            
        }

    })
  
return locationScore;
}


module.exports = 
{
    locationMatch: locationMatch,
}
    