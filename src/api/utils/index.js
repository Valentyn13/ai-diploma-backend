const {Types, isValidObjectId} = require('mongoose');
const castToMongoID = (ID) => {
  return Types.ObjectId(ID);
};

module.exports = {
  castToMongoID,
};
