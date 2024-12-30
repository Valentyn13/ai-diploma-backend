/* eslint-disable no-restricted-syntax */
const {getChatsByCategory} = require('./aggregations');
const splitArrayToGroups = require('../../../helpers/splitArrayToGroups');
const {createSdkBatch, checkAndRetrieveBatchData} = require('../../../config/llm/api');
const SharedCategoryBatch = require('../../models/sharedCategoryBatches');
const logger = require('../../../config/logger');

const checkAndGetBatchData = async () => {
  try {
    const batches = await SharedCategoryBatch.find({processing_status: 'in_progress', type: 'common'});
    if (batches.length === 0) {
      return;
    }

    await checkAndRetrieveBatchData(batches);
  } catch (error) {
    logger.error(`Error in Shared context checkAndGetBatchData: ${error}`);
  }
};

const processFailedRequests = async () => {
  try {
    const failedRequests = await SharedCategoryBatch.find({
      hasErrorsInSubRequests: true,
      isErrorProcessed: false,
      processing_status: 'ended',
      type: 'common',
    });

    if (failedRequests.length === 0) {
      return;
    }
    const promises = failedRequests.map(async (batch) => {
      const payloadOfFailedRequests = batch.requestPayload.filter((item) =>
        batch.failedRequestsIds.includes(item.uuid),
      );

      await SharedCategoryBatch.updateOne(
        {batchId: batch.batchId},
        {
          $set: {isErrorProcessed: true},
        },
      );

      const retryBatch = await createSdkBatch(payloadOfFailedRequests);

      await SharedCategoryBatch.create({
        batchId: retryBatch.id,
        processing_status: retryBatch.processing_status,
        created_at: retryBatch.created_at,
        hasErrorsInSubRequests: false,
        type: 'error',
        isErrorProcessed: true,
        failedRequestsIds: [],
        requestPayload: payloadOfFailedRequests,
        status_check_time: Date.now(),
      });
    });

    await Promise.all(promises);
  } catch (error) {
    logger.error(`Error in Shared context processFailedRequests: ${error}`);
  }
};

const checkAndRetrieveErrorBatchData = async () => {
  try {
    const errorBatches = await SharedCategoryBatch.find({processing_status: 'in_progress', type: 'error'});
    await checkAndRetrieveBatchData(errorBatches);
  } catch (error) {
    logger.error(`Error in Shared context checkAndRetrieveErrorBatchData: ${error}`);
  }
};

// ////////////////
// CRON JOBS TO RUN
// ////////////////

const sendBatchMessagesCronJob = async () => {
  try {
    const result = await getChatsByCategory();

    const normalizedData = result.map((item) => {
      return {
        category: item.category,
        userId: item.userId,
        uuid: `${item.userId}-${item.category}`,
        messages: item.messages.flat(),
      };
    });

    const groups = splitArrayToGroups(normalizedData, 30);

    for await (const group of groups) {
      const batch = await createSdkBatch(group);

      await SharedCategoryBatch.create({
        batchId: batch.id,
        processing_status: batch.processing_status,
        created_at: batch.created_at,
        hasErrorsInSubRequests: false,
        isErrorProcessed: false,
        failedRequestsIds: [],
        type: 'common',
        requestPayload: group,
        status_check_time: Date.now(),
      });
    }
  } catch (error) {
    logger.error(`Error in Shared context sendBatchMessagesCronJob: ${error}`);
  }
};

const retrieveAndProcessAllDataCronJob = async () => {
  try {
    await checkAndGetBatchData();
    await processFailedRequests();
    await checkAndRetrieveErrorBatchData();
  } catch (error) {
    logger.error(`Error in Shared context retrieveAndProcessAllDataCronJob: ${error}`);
  }
};

module.exports = {
  sendBatchMessagesCronJob,
  retrieveAndProcessAllDataCronJob,
};
