import { getFirstName, isValidPassword } from '../src/utils/user';

it('Should return first name when given full name', () => {
  const firstName = getFirstName('Sayaka Ono');

  expect(firstName).toBe('Sayaka');
});

it('Should return first name when given first name', () => {
  const firstName = getFirstName('Jen');

  expect(firstName).toBe('Jen');
});

it('Should reject password shorter than 8 characters', () => {
  const isValid = isValidPassword('short');
  expect(isValid).toBe(false);
});

it('Should reject password that contains word password', () => {
  const isValid = isValidPassword('longpassword');
  expect(isValid).toBe(false);
});

it('Should correctly validate a valid password', () => {
  const isValid = isValidPassword('1233abcd');
  expect(isValid).toBe(true);
});
