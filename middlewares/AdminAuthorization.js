const { User } = require('../models');

function authorization(req, res, next) {
  const authenticatedUser = res.locals.User;

  if (!authenticatedUser) {
    return res.status(401).json({
      name: 'Unauthorized',
      devMessage: 'User not authorized',
    });
  }

  User.findByPk(authenticatedUser.id)
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({
          name: 'Data not found',
          devMessage: `User with id ${authenticatedUser.id} not found`,
        });
      }

      if (foundUser.role === 'admin') {
        return next();
      } else {
        return res.status(403).json({
          name: 'Authorization failed',
          devMessage: 'User does not have permission to perform this action',
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        name: 'Internal Server Error',
        devMessage: err.message,
      });
    });
}

module.exports = { authorization };
