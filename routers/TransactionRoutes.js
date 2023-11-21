const router = require('express').Router();
const TransactionController = require('../controllers/transactionController');
const { authorization } = require('../middlewares/AdminAuthorization');

router.post('/', TransactionController.CreateTransactionHistory);

router.get('/user', TransactionController.GetUserTransactions);

router.get('/admin', authorization, TransactionController.GetAdminTransactions);

router.get('/:id', TransactionController.GetUserTransactionsById);

module.exports = router;
