const User = require('../models/user.model');
const logger = require('../../config/logger');

/**
 * Handle RevenueCat Events
 * @public
 */
exports.webhook = async (req, res, next) => {
  try {
    const {event} = req.body;
    logger.info(`Received RC webhook: ${event.type}`);
    const {
      app_user_id: email,
      store,
      entitlement_ids: entitlements,
      expiration_at_ms: expiresAt,
      transaction_id: recentTransactionID,
      purchased_at_ms: purchasedAt,
    } = event;
    const user = await User.findOne({email}).lean();

    if (!user) {
      logger.error('User not found!');
      logger.debug(event);
      res.send('OK');
      return;
    }

    const membership = user.membership || {};

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'NON_RENEWING_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE':
      case 'CANCELLATION':
        await User.updateOne(
          {_id: user._id},
          {
            membership: {
              ...membership,
              entitlements: entitlements || membership.entitlements,
              expiresAt: expiresAt || membership.expiresAt,
              purchasedAt: purchasedAt || membership.purchasedAt,
              recentTransactionID: recentTransactionID || membership.recentTransactionID,
              store: store || membership.store,
            },
          },
        );
        break;
      case 'BILLING_ISSUE':
        logger.info(`[BILLING_ISSUE] ${email}`);
        break;
      default:
        logger.warn('Unhandled event type: ', event.type);
    }
    res.send('OK');
  } catch (error) {
    next(error);
  }
};
