const { TransactionHistory, Product, User, Category } = require('../models');
const formatCurrency = require('../helpers/FormatCurrency');

class TransactionController {
  static async CreateTransactionHistory(req, res) {
    const { productId, quantity } = req.body;

    try {
      // 1. Pengecekan data product
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // 2. Pengecekan stock product
      if (quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      // 3. Pengecekan balance user
      const userId = req.UserData.id;
      const user = await User.findByPk(userId);
      if (!user || user.balance < product.price * quantity) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // 4. Update stock, balance, and sold_product_amount
      const updatedProduct = await Product.update(
        { stock: product.stock - quantity },
        { where: { id: productId }, returning: true }
      );

      const updatedUser = await User.update(
        { balance: user.balance - product.price * quantity },
        { where: { id: userId }, returning: true }
      );

      const category = await Category.findByPk(product.CategoryId);
      if (!category) {
        return res.status(500).json({ message: 'Category not found' });
      }

      const updatedCategory = await Category.update(
        { sold_product_amount: category.sold_product_amount + quantity },
        { where: { id: product.CategoryId }, returning: true }
      );

      // 5. Create TransactionHistory
      const newTransactionHistory = await TransactionHistory.create({
        ProductId: productId,
        UserId: userId,
        quantity: quantity,
        total_price: product.price * quantity,
      });

      res.status(201).json({
        message: 'You have successfully purchased the product',
        transactionBill: {
          total_price: newTransactionHistory.total_price,
          quantity: newTransactionHistory.quantity,
          product_name: product.title, // Gantilah dengan atribut yang sesuai
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async GetAdminTransactions(req, res) {
    const UserId = req.UserData.id;

    try {
      const userTransactions = await TransactionHistory.findAll({
        where: { UserId: UserId },
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
            include: [
              {
                model: Category,
                attributes: ['id'],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'email', 'balance', 'gender', 'role'],
          },
        ],
      });

      // Format data transaksi sesuai dengan kebutuhan
      const formattedTransactions = userTransactions.map((transaction) => {
        return {
          ProductId: transaction.ProductId,
          UserId: transaction.UserId,
          quantity: transaction.quantity,
          total_price: formatCurrency(transaction.total_price),
          createdat: transaction.createdAt,
          updatedat: transaction.updatedAt,
          product: {
            id: transaction.Product.id,
            title: transaction.Product.title,
            price: formatCurrency(transaction.Product.price),
            stock: transaction.Product.stock,
            CategoryId: transaction.Product.Category.id,
          },
          user: {
            id: transaction.User.id,
            email: transaction.User.email,
            balance: formatCurrency(transaction.User.balance),
            gender: transaction.User.gender,
            role: transaction.User.role,
          },
        };
      });

      res.status(200).json({ transactionHistories: formattedTransactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async GetUserTransactions(req, res) {
    const UserId = req.UserData.id;

    try {
      const userTransactions = await TransactionHistory.findAll({
        where: { UserId: UserId },
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
            include: [
              {
                model: Category,
                attributes: ['id'],
              },
            ],
          },
        ],
      });

      // Format data transaksi sesuai dengan kebutuhan
      const formattedTransactions = userTransactions.map((transaction) => {
        return {
          ProductId: transaction.ProductId,
          UserId: transaction.UserId,
          quantity: transaction.quantity,
          total_price: formatCurrency(transaction.total_price),
          createdat: transaction.createdAt,
          updatedat: transaction.updatedAt,
          product: {
            id: transaction.Product.id,
            title: transaction.Product.title,
            price: formatCurrency(transaction.Product.price),
            stock: transaction.Product.stock,
            CategoryId: transaction.Product.Category.id,
          },
        };
      });

      res.status(200).json({ transactionHistories: formattedTransactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async GetUserTransactionsById(req, res) {
    const UserId = req.UserData.id;
    const { id } = req.params;

    try {
      const userTransaction = await TransactionHistory.findOne({
        where: { id: id, UserId: UserId },
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
            include: [
              {
                model: Category,
                attributes: ['id'],
              },
            ],
          },
        ],
      });

      if (!userTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Format data transaksi sesuai dengan kebutuhan
      const formattedTransaction = {
        ProductId: userTransaction.ProductId,
        UserId: userTransaction.UserId,
        quantity: userTransaction.quantity,
        total_price: formatCurrency(userTransaction.total_price),
        createdat: userTransaction.createdAt,
        updatedat: userTransaction.updatedAt,
        product: {
          id: userTransaction.Product.id,
          title: userTransaction.Product.title,
          price: formatCurrency(userTransaction.Product.price),
          stock: userTransaction.Product.stock,
          CategoryId: userTransaction.Product.Category.id,
        },
      };

      res.status(200).json({ transactionHistory: formattedTransaction });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = TransactionController;
