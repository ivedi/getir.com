const { PORT: port } = require('./config');
const express = require('express');
const db  = require('./db');
const { handle: responseHandler, responseTags }  = require('./response-handler');
const valid = require('./valid');

const app = express();
app.use(require('body-parser').json());

app.post('/records', async (req, res) => {
  try {
    await Promise.resolve(valid.validFilter({ ...req.body }));  // validate payload
    const filter = normalizeFilter({ ...req.body });            // normalize payload
    const records = await db.getRecords(filter);                // fetch data
    const response = responseHandler({ responseTag: responseTags.SUCCESS, data: { records } }); // prepare proper response
    res.send(response);
  } catch (error) {
    res.status(error.httpStatus || 500).send(error);
  }
});

//The 404 Route (ALWAYS Keep this as the last route)
app.all('*', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const response = responseHandler({ responseTag: responseTags.DEATH_ENDPOINT, data: fullUrl }); // prepare proper response
  res.status(response.httpStatus).send(response);
});
app.listen(port, () => console.log(`app listening on port ${port}!`));

// normalize response payload filter for future usage
const normalizeFilter = ({ startDate, endDate, minCount, maxCount }) => {

  // end date will be the exact start time of date
  // when convert string into date
  // we must set the exact start time of the day after endDate
  // to fetch endDate data too
  const _endDate = typeof endDate !== 'undefined' ? addDay(new Date(endDate)) : endDate;

  return {
    startDate: typeof startDate !== 'undefined' ? new Date(startDate) : startDate,
    endDate: _endDate,
    minCount,
    maxCount
  };
};

const addDay = (date, dayCount = 1) => {
  let _date = new Date(date.getTime());
  return new Date(_date.setDate(_date.getDate() + dayCount));
}