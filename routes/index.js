var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');
var meetup = require('meetup');


router.get('/', function(req, res) {
  res.render('home', {
    title: 'ProvoJS',
    meetupTitle: 'The meetupTitle',
    meetupDate: '19',
    meetupDateTime: 'Friday, March 19th',
    meetupLocation: 'DevMountain Provo, UT',
    meetupMonth: 'MAR',
    meetupSpeaker: 'Bob Barker',
  });
});

router.get('/slack', function(req, res) {
  res.render('slack', { community: config.community });
});

router.post('/invite', function(req, res) {
  if (!req.body.email) {
    return res.status(400).send('email is required.');
  }

  request.post({
    url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
    form: {
      email: req.body.email,
      token: config.slacktoken,
      set_active: true
    }
  }, function(err, httpResponse, body) {
    // body looks like:
    //   {"ok":true}
    //       or
    //   {"ok":false,"error":"already_invited"}
    if (err) { return res.send('Error:' + err); }
    body = JSON.parse(body);
    if (body.ok) {
      res.send('Success! Check "'+ req.body.email +'" for an invite from Slack.');
    } else {
      res.send('Failed! ' + body.error)
    }
  });
});

module.exports = router;
