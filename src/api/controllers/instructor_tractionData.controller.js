const Instructor_tractionData = require('../models/instructor_tractionData');
const User = require('../models/user.model');
const {castToMongoID} = require('../utils/index');

exports.saveInstructor_tractionData = async (req, res, next) => {
  try {
    const {user, body} = req;
    const {_id, name: instructorName, ...rest} = body.data;
    const data = {
      userId: user._id,
      name: user.name,
      instructorId: body.data._id,
      instructorName: instructorName,
      ...rest,
    };
    console.log('data', data);
    const instructor = await Instructor_tractionData(data).save();
    // console.log('XXX', instructor);
    return res.send(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
