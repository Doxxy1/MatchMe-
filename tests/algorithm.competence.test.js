const competence = require('./../competence.js');

var competencesA = [{skill: "Teamwork", level: "Expert"}, {skill: "English", level: "Expert"}];
var competencesB = [{skill: "Teamwork", level: "Expert"}, {skill: "Management", level: "Expert"}];
var competencesC = [{skill: "Python", level: "Expert"}, {skill: "Java", level: "Expert"}];

test('Compares identical competences to return a score of 1', () => {
    expect(competence.skillMatch(competencesA, competencesA)).toBe(1);
});

test('Compares different competences to return a score of 0.5', () => {
    expect(competence.skillMatch(competencesA, competencesB)).toBe(0.5);
})
;

test('Compares different competences to return a score of 0', () => {
    expect(competence.skillMatch(competencesA, competencesC)).toBe(0);
})
;