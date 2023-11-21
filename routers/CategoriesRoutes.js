const router = require('express').Router();
const CategoryController = require('../controllers/categoryController');
const { authorization } = require('../middlewares/AdminAuthorization');

router.post('/', CategoryController.CreateCategory);

router.use('/', authorization);

module.exports = router;
