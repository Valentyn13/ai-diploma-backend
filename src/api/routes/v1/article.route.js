const express = require('express');
const controller = require('../../controllers/article.controller');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/articles List Articles
   * @apiDescription Get a list of articles
   * @apiVersion 1.0.0
   * @apiName ListArticles
   * @apiGroup Article
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} articles List of Articles.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(controller.list);

module.exports = router;
