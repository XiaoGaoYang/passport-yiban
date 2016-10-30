/**
 * Module dependencies.
 */
 var util = require('util')
 , OAuth2Strategy = require('passport-oauth2')
 , InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The yiban authentication strategy authenticates requests by delegating to
 * yiban using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your yiban application's app key
 *   - `clientSecret`  your yiban application's app secret
 *   - `callbackURL`   URL to which yiban will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new YiBanStrategy({
 *         clientID: 'app key',
 *         clientSecret: 'app secret'
 *         callbackURL: 'https://www.example.net/auth/yiban/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://openapi.yiban.cn/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://openapi.yiban.cn/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'yiban';

  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
 util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from yiban.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `yiban`
 *   - `id`               易班用户id
 *   - `username`         易班用户名
 *   - `avatar`           头像地址
 *   - `school`           学校名称
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var oauth2 = this._oauth2;
  // console.log('accessToken:',accessToken);
  oauth2.get('https://openapi.yiban.cn/user/me?access_token='+accessToken, '', function (err, body, res) {
    if(err){
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    try{
      var json = JSON.parse(body);
      if(json.status !== 'success'){
        console.log('获取用户信息失败：',json);
        return done(new Error('获取用户信息失败'));
      }
      var profile = {
        provider: 'yiban',
        id: json.info.yb_userid,
        username: json.info.yb_username,
        school: json.info.yb_schoolname,
        avatar: json.info.yb_userhead,
        _raw: body,
        _json: json
      };
      done(null, profile);
    }catch(e){
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
 module.exports = Strategy;
