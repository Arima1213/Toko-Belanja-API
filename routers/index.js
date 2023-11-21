const router = require('express').Router();
const userRoutes = require('./UserRoutes');
const categoriesRoutes = require('./CategoriesRoutes');
const ProductsRoutes = require('./ProductRoutes');
const TransactionRoutes = require('./TransactionRoutes');
const { authentication } = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Selamat datang di MyGram API!' });
});

router.use('/users', userRoutes);

router.use('/categories', authentication, categoriesRoutes);

router.use('/products', authentication, ProductsRoutes);

router.use('/transactions', authentication, TransactionRoutes);

module.exports = router;
