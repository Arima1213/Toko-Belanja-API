const router = require('express').Router();
const UserController = require('../controllers/userControllers');
const { authentication } = require('../middlewares/auth');
const { authorization } = require('../middlewares/UserAuthorization');

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.post('/topup', authentication, UserController.topup);

router.delete(
  '/',
  [authentication, authorization],
  UserController.DeleteUserById
);

router.put('/', [authentication, authorization], UserController.UpdateUserById);

module.exports = router;
