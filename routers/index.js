const router = require('express').Router();
const userRoutes = require('./UserRoutes');
const categoriesRoutes = require('./CategoriesRoutes');
const ProductsRoutes = require('./ProductRoutes');
const { authentication } = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Selamat datang di MyGram API!' });
});

router.use('/users', userRoutes);

router.use('/categories', authentication, categoriesRoutes);

router.use('/products', authentication, ProductsRoutes);

module.exports = router;
