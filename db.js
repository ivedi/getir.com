const { MONGODB_URI } = require('./config');
const { handle: responseHandler, responseTags }  = require('./response-handler');
const { connection, connect, Schema, model } = require('mongoose');
connection.once('open', () => console.log('Database is connected!'));
connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const recordSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  }
}, {timestamps:true});

const Record = model('records', recordSchema);

// create query filter for reaching database records
const createFilter = (startDate, endDate, minCount, maxCount) => {
  const filter = {};
  createBetweenFilter(filter, 'createdAt', startDate, endDate, false);
  createBetweenFilter(filter, 'totalCount', minCount, maxCount);
  return filter;
}

// create query filter interval
const createBetweenFilter = (filter, field, start, end, includeEnd = true) => {
  if (typeof start !== 'undefined'
    && typeof end !== 'undefined') {
    filter[field] = { $gte: start };
    filter[field][includeEnd ? '$lte' : '$lt'] = end;
  } else if (typeof start !== 'undefined') {
    filter[field] = { $gte: start };
  } else if (typeof end !== 'undefined') {
    filter[field] = includeEnd ? { $lte: end } : { $lt: end };
  }
  return filter;
}

class db {
  closeConnection() {
    connection.close();
  }
  // fetch records from database
  getRecords({ startDate, endDate, minCount, maxCount }) {
    const filter = createFilter(startDate, endDate, minCount, maxCount);
    return Record.find(filter, '-_id key totalCount createdAt', (err, records) => {
      if (err) {
        throw new Error(responseHandler(responseTags.UNKNOWN));
      }
      return records;
    });
  }
  // insert a new record into database
  saveRecord({ key, totalCount }) {
    return new Record({ key, totalCount }).save(function (err) {
      if (err) {
        throw new Error(responseHandler(responseTags.UNKNOWN));
      }
    });
  }
}

module.exports = new db();