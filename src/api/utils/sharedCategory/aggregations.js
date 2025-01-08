const Chats = require('../../models/chats.model');
const logger = require('../../../config/logger');

async function getChatsByCategory() {
  // NOTE: value should correspond to the frequency of the cron job (currently it's every 12 hours).
  // const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const last12Hours = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const result = await Chats.aggregate([
    // Stage 1: Match chats where category exists and was created/updated in the last 24 hours
    {
      $match: {
        category: {$exists: true},
        updatedAt: {$gte: last12Hours},
      },
    },
    // Stage 2: Group by userId to collect unique categories modified by each user
    {
      $group: {
        _id: '$userId',
        categoriesModified: {$addToSet: '$category'},
      },
    },
    // Stage 3: Unwind categoriesModified to process categories individually
    {$unwind: '$categoriesModified'},
    // Stage 4: Lookup the latest 5 chats for each category with more than 3 messages
    {
      $lookup: {
        from: 'chats',
        let: {userId: '$_id', category: '$categoriesModified'},
        pipeline: [
          {$match: {$expr: {$and: [{$eq: ['$userId', '$$userId']}, {$eq: ['$category', '$$category']}]}}},
          {$match: {'messages.3': {$exists: true}}}, // Filter chats with more than 3 messages
          {$sort: {updatedAt: -1}}, // Sort by most recently updated
          {$limit: 5}, // Limit to 5 chats per category
        ],
        as: 'chats',
      },
    },
    // Stage 5: Group all user messages from the selected chats into one array
    {
      $addFields: {
        messages: {
          $reduce: {
            input: '$chats.messages',
            initialValue: [],
            in: {$concatArrays: ['$$value', '$$this']},
          },
        },
      },
    },
    // Stage 6: Filter messages to keep only user messages
    {
      $addFields: {
        messages: {
          $filter: {
            input: '$messages',
            as: 'message',
            cond: {$eq: ['$$message.role', 'user']},
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        category: '$categoriesModified',
        messages: 1,
      },
    },
    {
      $match: {
        messages: {$ne: []},
      },
    },
  ]);

  logger.info('Category context generation chats length: ', result?.length || 0);

  return result;
}

module.exports = {getChatsByCategory};
