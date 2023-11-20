const router = require('express').Router();

const userRoutes = require('./UserRoutes');
const { authentication } = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Selamat datang di MyGram API!' });
});

router.use('/users', userRoutes);

module.exports = router;
