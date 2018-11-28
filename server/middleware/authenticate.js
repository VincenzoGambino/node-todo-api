var {User} = require('./../models/user');


/**
 * Middleware for authentication
 * @param req
 * @param res
 * @param next
 */
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};


module.exports = {authenticate};