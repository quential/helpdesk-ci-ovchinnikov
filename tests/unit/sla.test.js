const { responseMinutes } = require('../../src/sla');

test.each([['low', 480], ['medium', 240], ['high', 60]])(
  '%s priority has %i minutes', (priority, expected) => {
    expect(responseMinutes(priority)).toBe(expected);
  }
);

test.each(['unknown', 'toString', '', null])('rejects %s', (priority) => {
  expect(() => responseMinutes(priority)).toThrow(RangeError);
});

test('critical priority has 15 minutes', () => {
  expect(responseMinutes('critical')).toBe(15);
});
