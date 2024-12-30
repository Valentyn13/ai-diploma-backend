const mongoose = require('mongoose');

const PROCESSING_STATUS = ['in_progress', 'ended'];

const sharedCategoryBatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['common','error'],
    required: true,
    default: 'common',
  },
  processing_status: {
    type: String,
    enum: PROCESSING_STATUS,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status_check_time: {
    type: Date,
    default: Date.now,
  },
  hasErrorsInSubRequests: {
    type: Boolean,
    default: false,
  },
  isErrorProcessed: {
    type: Boolean,
    default: false,
  },
  failedRequestsIds: {
    type: [String],
    default: [],
  },
  requestPayload: {
    type: [Object],
    default: [],
  },
});

const SharedCategoryBatch = mongoose.model('SharedCategoryBatch', sharedCategoryBatchSchema);

module.exports = SharedCategoryBatch;
