const typeofwork = require('./../typeofwork.js');

test('Compares part time work to part time and full time work to return a score of 1', () => {
    expect(typeofwork.workMatch(2,3)).toBe(1);
});

test('Compares full time work to part time work to return a score of 0', () => {
    expect(typeofwork.workMatch(1,2)).toBe(0);
});

test('Compares full time and casual work to full time work to return a score of 1', () => {
    expect(typeofwork.workMatch(5,1)).toBe(1);
});


