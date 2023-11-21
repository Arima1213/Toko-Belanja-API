const router = require('express').Router();
const CategoryController = require('../controllers/categoryController');
const { authorization } = require('../middlewares/AdminAuthorization');

router.post('/', authorization, CategoryController.CreateCategory);

router.get('/', CategoryController.GetAllCategories);

router.patch('/:id', authorization, CategoryController.UpdateOneCategoryById);

module.exports = router;
