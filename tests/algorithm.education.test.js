const education = require('./../degree.js');

var educationsA = [{level: "High School", field: "General"}, {level: "Bachelor", field: "Information Techonology"}];
var educationsB = [{level: "High School", field: "General"}, {level: "Bachelor", field: "Law"}];
var educationsC = [{level: "Bachelor", field: "Arts"}, {level: "Master", field: "Psychology"}];

test('Compares identical education to return a score of 1', () => {
    expect(education.degreeMatch(educationsA, educationsA)).toBe(1);
});

test('Compares different education to return a score of 0.5', () => {
    expect(education.degreeMatch(educationsA, educationsB)).toBe(0.5);
})
;

test('Compares different education to return a score of 0', () => {
    expect(education.degreeMatch(educationsA, educationsC)).toBe(0);
})
;