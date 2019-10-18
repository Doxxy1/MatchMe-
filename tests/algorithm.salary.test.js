const salary = require('./../salary.js');

test('Compares higher job salary to return a score of 1', () => {
    expect(salary.salaryMatch(90000, 100000)).toBe(1);
});



test('Compares a lower salary to return a score of 0.8', () => {
    expect(salary.salaryMatch(100000, 80000)).toBe(0.8);
});

test('Compares a lower salary to return a score of 0.5', () => {
    expect(salary.salaryMatch(100000, 50000)).toBe(0.5);
});