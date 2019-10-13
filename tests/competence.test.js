const competence = require('./../competence.js');

var competencesA = [{skill: "Teamwork", level: "Expert"}];
var competencesB = [{skill: "Management", level: "Expert"}];

test('Compares identical competences to return a score of 1', () => {
    expect(competence.skillMatch(competencesA, competencesA)).toBe(1);
})

test('Compares different competences to return a score of 0', () => {
    expect(competence.skillMatch(competencesA, competencesB)).toBe(0);
})
;