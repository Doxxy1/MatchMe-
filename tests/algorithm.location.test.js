const location = require('./../location.js');

//jest.setTimeout(50000);
test('Location', async () => {
    const locationScore = await location.locationMatch("MELBOURNE", "MELBOURNE");
    expect(locationScore).toBe({});
})
;

