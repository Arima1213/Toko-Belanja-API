const router = require('express').Router();
const ProductController = require('../controllers/productController');
const { authorization } = require('../middlewares/AdminAuthorization');

router.post('/', authorization, ProductController.CreateProduct);

router.get('/', ProductController.GetAllProducts);

router.patch('/:id', authorization, ProductController.UpdateOneProductById);

// router.delete('/:id', authorization, CategoryController.DeleteOneCategoryById);

module.exports = router;
