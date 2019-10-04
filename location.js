const locationMatch = function(applicatianlocation,joblocation)
{
    var locationScore = 0;
    //Location Score 
    var distance = require('google-distance-matrix');
    var origins = [joblocation];
    var destinations = [applicatianlocation];
     
    distance.key('AIzaSyAvEJ0_IbB0kgEJvbKIsHZuzVTNO3QMTFo');
     
    distance.matrix(origins, destinations, function (err, distances) {
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
                    if (distances.rows[0].elements[j].status == 'OK') {
                        var distance = distances.rows[i].elements[j].distance.text;
                       console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                        if(origin == destination)
                        {
                            locationScore  =  1;
                            
                            console.log("Good match" + locationScore)
                        }
                        else if(distance <=20) 
                        {
                            console.log("<20")

                            locationScore  = locationScore + 1;
                        }
                        else if(distance <=30)
                        {
                            console.log("<30")

                            locationScore  = locationScore + .8;

                        }
                        else if(distance <=50)
                        {
                            locationScore  = locationScore + .6;

                        }
                        else if(distance <=70)
                        {
                            locationScore  = locationScore + .4;

                        }
                        else if(distance >70)
                        {
                            locationScore  = locationScore + 0;

                        }

                    } else {
                        console.log(destination + ' is not reachable by land from ' + origin);
                    }
                }
            }
            
        }

    });

    return locationScore;
}


module.exports = 
{
    locationMatch: locationMatch,
}
    