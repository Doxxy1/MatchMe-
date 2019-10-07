const getDistance = (origins, destinations) => {
    return new Promise((resolve, reject) => {
        const distance = require('google-distance-matrix');
        distance.matrix(origins, destinations, (err, distances) => {
            console.log("I was called3")
    
            if (err) {
                console.log('Error');
                resolve(0);
            }

            if(!distances) {
                console.log('No distances found. ');
                resolve(0);
            }

            if (distances.status == 'OK') {
                for (var i=0; i < origins.length; i++) {
                    for (var j = 0; j < destinations.length; j++) {
                        var origin = distances.origin_addresses[i];
                        var destination = distances.destination_addresses[j];
                        if (distances.rows[0].elements[j].status == 'OK')
                         {
                            var distanceS = distances.rows[i].elements[j].distance.text;
                            distanceS = distanceS.replace("km",'')
                            distanceS = distanceS.replace(",",'')

                            var distance = parseInt(distanceS);
                            console.log("Test 2")
                            if(origin == destination)
                            {
                               var locationScore  =  1;
                                
                                console.log("Good match" + locationScore)
                                resolve(locationScore);
    
                            }
                            else if(distance <=20) 
                            {
                                console.log("<20")
    
                                var locationScore  = locationScore + 1;
                                resolve(locationScore);
                            }
                            else if(distance <=30)
                            {
                                console.log("<30")
    
                              var   locationScore  = locationScore + .8;
                                resolve(locationScore);
    
                            }
                            else if(distance <=50)
                            {
                              var   locationScore  = locationScore + .6;
                                resolve(locationScore);
    
                            }
                            else if(distance <=70)
                            {
                               var locationScore  = locationScore + .4;
                                resolve(locationScore);
    
                            }
                            else if(distance >70)
                            {
                                var locationScore  =  0;
                                resolve(locationScore);
    
                            }
    
                        } else {

                            console.log(destination + ' is not reachable by land from ' + origin);
                            resolve(locationScore);

                        }
                    }
                }
                
            }
    
        })
    });
}

const locationMatch = async function(applicatianlocation,joblocation)
{
    console.log("I was called")
    var distance = require('google-distance-matrix');
    var origins = [joblocation];
    var destinations = [applicatianlocation];
    distance.key('AIzaSyAvEJ0_IbB0kgEJvbKIsHZuzVTNO3QMTFo');
    console.log("I was called2")

    const locationScore = await getDistance(origins, destinations);
    
    return locationScore;
}


module.exports = 
{
    locationMatch: locationMatch,
}
    