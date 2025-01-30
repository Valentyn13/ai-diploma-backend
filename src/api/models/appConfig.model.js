const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const AppConfig = mongoose.model('AppConfig', appConfigSchema);


module.exports = AppConfig;
