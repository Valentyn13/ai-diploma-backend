const APIError = require('../utils/APIError');

const ObjectId = require('mongoose').Types.ObjectId;

const validateObjectId = (id) => {
  const isValid = ObjectId.isValid(id);
  if (!isValid) {
    throw new APIError({
      message: 'Invalid ObjectId',
      status: 400,
    });
  }
};

module.exports = validateObjectId;
