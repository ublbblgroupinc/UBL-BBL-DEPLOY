import { add } from './addfunction.js'

test('check add function works properly', () => {
  expect(add(2, 3)).toEqual(5);
});

test('adds -1 + 1 to equal 0', () => {
  expect(add(-1, 1)).toBe(0);
});
