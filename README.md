# passport-yiban

copied and revised from [passport-github](https://github.com/jaredhanson/passport-github) by [Jared Hanson](http://github.com/jaredhanson)

[passport](http://passportjs.org/) strategy for authenticating with [YiBan](http://www.yiban.cn/)
using the OAuth 2.0 API.

This module lets you authenticate using yiban in your Node.js applications.
By plugging into Passport, yiban authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install --save passport-yiban

## Usage

#### Configure Strategy

The YiBan authentication strategy authenticates users using a YiBan account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new YiBanStrategy({
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL: "http://127.0.0.1:3000/auth/yiban/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ yibanId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'yiban'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/yiban',
      passport.authenticate('yiban'),
      function(req, res){
        // The request will be redirected to yiban for authentication, so this
        // function will not be called.
      });

    app.get('/auth/yiban/callback', 
      passport.authenticate('yiban', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
