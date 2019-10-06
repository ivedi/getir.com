/**
 * @jest-environment node
 */

const db = require('./db');
const valid = require('./valid');

/*****getRecords tests*****/
test('empty filter should return all records', async () => {
  const recs = await db.getRecords({ });
  expect(valid.validArray(recs)).toBeTruthy();
  recs.forEach(rec => expect(valid.validRecord(rec)).toBeTruthy());
});

(({ startDate, endDate, minCount, maxCount }) => {
  test(`should return all records with totalCount greater than or equal ${minCount}`, async () => {
    const recs = await db.getRecords({ minCount });
    recs.forEach(rec => expect(rec.totalCount).toBeGreaterThanOrEqual(minCount));
  });
  
  test(`should return all records with totalCount less than or equal ${maxCount}`, async () => {
    const recs = await db.getRecords({ maxCount });
    recs.forEach(rec => expect(rec.totalCount).toBeLessThanOrEqual(maxCount));
  });
  
  test(`should return all records with totalCount between ${minCount} and ${maxCount}`, async () => {
    const recs = await db.getRecords({ minCount, maxCount });
    recs.forEach(rec => {
      expect(rec.totalCount).toBeGreaterThanOrEqual(minCount);
      expect(rec.totalCount).toBeLessThanOrEqual(maxCount);
    });
  });

  test(`should return all records with createdAt after than or equal ${startDate}`, async () => {
    const _startDate = new Date(startDate);
    const recs = await db.getRecords({ startDate: _startDate });
    recs.forEach(rec => expect(rec.createdAt >= _startDate).toBeTruthy());
  });
  
  test(`should return all records with createdAt before than or equal ${endDate}`, async () => {
    // end date will be the exact start time of date
    // when convert string into date
    // we must set the exact start time of the day after endDate
    // to fetch endDate data too
    const _endDate = addDay(new Date(endDate));
    const recs = await db.getRecords({ endDate: _endDate });
    recs.forEach(rec => expect(rec.createdAt < _endDate).toBeTruthy());
  });
  
  test(`should return all records with createdAt between ${startDate} and ${endDate}`, async () => {
    const _startDate = new Date(startDate);
    // end date will be the exact start time of date
    // when convert string into date
    // we must set the exact start time of the day after endDate
    // to fetch endDate data too
    const _endDate = addDay(new Date(endDate));
    const recs = await db.getRecords({ startDate: _startDate, endDate: _endDate });
    recs.forEach(rec => {
      expect(rec.createdAt >= _startDate).toBeTruthy()
      expect(rec.createdAt < _endDate).toBeTruthy();
    });
  });

  test(`should return all records with createdAt between ${startDate} and ${endDate} between ${minCount} and ${maxCount}`, async () => {
    const _startDate = new Date(startDate);
    // end date will be the exact start time of date
    // when convert string into date
    // we must set the exact start time of the day after endDate
    // to fetch endDate data too
    const _endDate = addDay(new Date(endDate));
    const recs = await db.getRecords({ minCount, maxCount, startDate: _startDate, endDate: _endDate });
    recs.forEach(rec => {
      expect(rec.createdAt >= _startDate).toBeTruthy()
      expect(rec.createdAt < _endDate).toBeTruthy();
      expect(rec.totalCount).toBeGreaterThanOrEqual(minCount);
      expect(rec.totalCount).toBeLessThanOrEqual(maxCount);
    });
  });
})({ startDate: '2019-10-05', endDate: '2019-10-06', minCount: 100, maxCount: 2400 });
/*****getRecords tests*****/

const addDay = (date, dayCount = 1) => {
  let _date = new Date(date.getTime());
  return new Date(_date.setDate(_date.getDate() + dayCount));
}

afterAll(async done => {
  db.closeConnection(); // free database resources
  done();
});