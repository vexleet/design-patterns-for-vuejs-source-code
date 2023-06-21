import {calcComplexity, isMatching} from "./renderless-password";

describe('renderless-password-mine', function () {
  describe('isMatching', function () {
    it('should return false if password is empty', function () {
      expect(isMatching('', 'password')).toBe(false);
    })

    it('should return false if confirmation is empty', function () {
      expect(isMatching('password', '')).toBe(false);
    })

    it('should return false if password and confirmation are different', function () {
      expect(isMatching('password', 'passw0rd')).toBe(false);
    })

    it('should return true if password and confirmation are the same', function () {
      expect(isMatching('password', 'password')).toBe(true);
    })
  });

  describe('calcComplexity', function () {
    it('should return 0 if password is empty', function () {
      expect(calcComplexity('')).toBe(0);
    })

    it('should return 0 if password is less than 5 characters', function () {
      expect(calcComplexity('pass')).toBe(0);
    })

    it('should return 1 if password is 5 characters or more', function () {
      expect(calcComplexity('passw')).toBe(1);
    })

    it('should return 2 if password is 7 characters or more', function () {
      expect(calcComplexity('passw0rd')).toBe(2);
    })

    it('should return 3 if password is 10 characters or more', function () {
      expect(calcComplexity('passw0rd!!')).toBe(3);
    })
  })
});
