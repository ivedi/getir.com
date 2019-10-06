const valid = require('./valid');
const { handle: responseHandler, responseTags } = require('./response-handler');

/******validInteger tests******/
test('undefined is a valid integer as default', () => {
  expect(valid.validInteger(undefined)).toBeTruthy();
});
/******validInteger tests******/
/******validPositiveInteger tests******/
test('undefined is a valid positive integer as default', () => {
  expect(valid.validPositiveInteger({ data: undefined, includeZero: true })).toBeTruthy();
});

/******validPositiveInteger tests******/

/******validFilterDate tests******/
test('undefined is a valid date as default', () => {
  expect(valid.validFilterDate(undefined)).toBeTruthy();
});

test('undefined is an invalid date if set allowUndefined to false', () => {
  const allowUndefined = false;
  expect(valid.validFilterDate(undefined, allowUndefined)).toBeFalsy();
});

test('0000-00-00 is an invalid date', () => {
  expect(valid.validFilterDate('0000-00-00')).toBeFalsy();
});

test('date with format DD-MM-YYYY is an invalid date', () => {
  expect(valid.validFilterDate('20-10-1987')).toBeFalsy();
});

test('date with format MM-DD-YYYY is an invalid date', () => {
  expect(valid.validFilterDate('10-20-1987')).toBeFalsy();
});

test('date with format YYYY-DD-MM is an invalid date', () => {
  expect(valid.validFilterDate('1987-20-10')).toBeFalsy();
});

test('date with format YYYY-MM-DD is a valid date', () => {
  expect(valid.validFilterDate('1987-10-04')).toBeTruthy();
});
/******validFilterDate tests******/

/******validFilter tests******/
test('filter with empty condition should be true', () => {
  expect(valid.validFilter({ })).toBeTruthy();
});

test('filter without params should be true', () => {
  expect(valid.validFilter()).toBeTruthy();
});

test('filter with negative minCount should throw a proper error', () => {
  const err = new Error(responseHandler(responseTags.INVALID_FIELD, 'minCount'));
  expect(() => { valid.validFilter({ minCount: -1 }) }).toThrow(err);
});

test('filter with maxCount value which is lower than 1 should throw a proper error', () => {
  const err = new Error(responseHandler(responseTags.INVALID_FIELD, 'minCount'));
  expect(() => { valid.validFilter({ maxCount: 0 }) }).toThrow(err);
  expect(() => { valid.validFilter({ maxCount: -10 }) }).toThrow(err);
});
/******validFilter tests******/
/******validRecord tests******/
test('a proper record with key, createdAt, totalCount should be valid', () => {
  const rec = {
    key: '5d989fd61c9d440000cd495z',
    totalCount: 11000,
    createdAt: new Date('2019-10-05T17:12:58.361+00:00')
  };
  expect(valid.validRecord(rec)).toBeTruthy();
});
/******validRecord tests******/