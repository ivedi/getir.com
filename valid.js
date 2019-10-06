const { handle: responseHandler, responseTags } = require('./response-handler');

class valid {
  // validate if data is integer
  validInteger(data, allowUndefined = true) {
    if (typeof data === 'string') {
      data = Number(data);
    }
    return (allowUndefined && typeof data === 'undefined') || Number.isInteger(data);
  }
  // validate if data is a positive integer
  validPositiveInteger({ data, includeZero, allowUndefined = true }) {
    return (allowUndefined && typeof data === 'undefined') || (this.validInteger(data, allowUndefined) && (includeZero ? data >= 0 : data > 0));
  }
  // validate if data is a proper date
  validDate(data) {
    return Object.prototype.toString.call(data) === "[object Date]"
      && !isNaN(data.getTime());
  }
  // validate if data is a proper date
  validFilterDate(data, allowUndefined = true) {
    // check if data is undefined
    if (allowUndefined && typeof data === 'undefined') {
      return true;
    }
    if (typeof data !== 'string') {
      return false; // Invalid type
    }
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!data.match(regEx)) {
      return false;  // Invalid format
    }
    var date = new Date(data);
    var dNum = date.getTime();
    if(!dNum && dNum !== 0) {
      return false; // NaN value, Invalid date
    }
    return date.toISOString().slice(0,10) === data;
  }
  // validate if data is valid array
  validArray(data) {
    return Array.isArray(data);
  }
  // validate if filter is a proper filter
  validFilter({ startDate, endDate, minCount, maxCount } = { }) {
    if (!this.validFilterDate(startDate)) {
      throw new Error(responseHandler(responseTags.INVALID_FIELD, 'startDate'));
    }
    if (!this.validFilterDate(endDate)) {
      throw new Error(responseHandler(responseTags.INVALID_FIELD, 'endDate'));
    }
    if (!this.validPositiveInteger({ data: minCount, includeZero: true})) {
      throw new Error(responseHandler(responseTags.INVALID_FIELD, 'minCount'));
    }
    if (!this.validPositiveInteger({ data: maxCount })) {
      throw new Error(responseHandler(responseTags.INVALID_FIELD, 'maxCount'));
    }
    return true;
  }
  // validate if data is a well-defined string
  validString({ data, allowEmptyString }) {
    return typeof data === 'string' && (allowEmptyString || data !== '');
  }
  // validate if data is a proper record object
  validRecord(data) {
    const { key, totalCount, createdAt } = data;
    
    return data
      && this.validString({ data: key })
      && this.validPositiveInteger({ data: totalCount, includeZero: true, allowUndefined: false })
      && this.validDate(createdAt);
  }
}

module.exports = new valid();