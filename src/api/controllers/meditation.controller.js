const Meditation = require('../models/meditation.model');

/**
 * Get meditation list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const meditations = await Meditation.list(req.query);
    const transformedMeditations = meditations.map(meditation => meditation.transform());
    res.json(transformedMeditations);
  } catch (error) {
    next(error);
  }
};
