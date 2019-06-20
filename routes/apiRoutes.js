const db = require('../models');
const snoowrap = require('snoowrap');

// NOTE: The following examples illustrate how to use snoowrap. However, hardcoding
// credentials directly into your source code is generally a bad idea in practice (especially
// if you're also making your source code public). Instead, it's better to either (a) use a separate
// config file that isn't committed into version control, or (b) use environment variables.

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper



module.exports = function(app) {

  const r = new snoowrap({
    userAgent: 'Treddit 1.0 by Stephen Chang',
    clientId: 'eeuo6tH6FkR0FQ',
    clientSecret: '_89r7SRlDhCTtJ0ilQuukSXURkU',
    refreshToken: '7881048-46rszR3pc4SbpMnJzgqsYLu5J6c'
  });

  // render front page
  app.get('/reddit', function(req, res) {
    r.getHot().then(function(result) {
      res.render('index', {
        redditHot: result
      });
      console.log(`subreddit: ${result[0].subreddit.display_name}`);
    });
  });

  // render comments
  app.get('/thread/:id', function(req, res) {
    r.getSubmission(req.params.id).comments.then(function(result) {
      r.getSubmission(req.params.id).title.then(function(titleResult) {
        console.log(titleResult);
        res.render('thread', {
          comments: result,
          title: titleResult
        });
      });
    });
  });

  // render comments in JSON for testing
  app.get('/thread/:id/json', function(req, res) {
    r.getSubmission(req.params.id).comments.then(function(result) {
      r.getSubmission(req.params.id).title.then(function(titleResult) {
        console.log(titleResult);
        console.log(result[0].subreddit)
        res.json(result);
      });
    });
  });

  // Delete an example by id
  app.delete('/api/examples/:id', function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
