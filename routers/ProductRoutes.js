const router = require('express').Router();
const ProductController = require('../controllers/productController');
const { authorization } = require('../middlewares/AdminAuthorization');

router.post('/', authorization, ProductController.CreateProduct);

router.get('/', ProductController.GetAllProducts);

router.put('/:id', authorization, ProductController.PutProductById);

router.patch('/:id', authorization, ProductController.PatchProductById);

router.delete('/:id', authorization, ProductController.DeleteOneProductById);

module.exports = router;
