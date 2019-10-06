const responseCode = {
  SUCCESS: 0,
  FAIL: 1
};
const responseTags = {
  SUCCESS: 'SUCCESS',
  INVALID_FIELD: 'INVALID_FIELD',
  DEATH_ENDPOINT: 'DEATH_ENDPOINT',
  UNKNOWN: 'UNKNOWN'
};

module.exports = {
  handle: ({ responseTag, data }) => {
    switch (responseTag) {
      case responseTags.SUCCESS:
        return {
          httpStatus: 200,
          code: responseCode.SUCCESS,
          msg: `Success`,
          ...data
        };
      case responseTags.INVALID_FIELD:
        return {
          httpStatus: 400,
          code: responseCode.FAIL,
          msg: `Failed! <Invalid Field: ${data}>`
        };
      case responseTags.DEATH_ENDPOINT:
        return {
          httpStatus: 404,
          code: responseCode.FAIL,
          msg: `Failed! <Endpoint "${data}" not found>`
        };
      case responseTags.UNKNOWN:
      default:
        return {
          httpStatus: 500,
          code: responseCode.FAIL,
          msg: 'Failed! <Something went wrong!>'
        };
    }
  },
  responseTags: responseTags
}