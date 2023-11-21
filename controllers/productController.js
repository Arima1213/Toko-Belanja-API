const { Product, Category } = require('../models');
const formatCurrency = require('../helpers/FormatCurrency');

class ProductController {
  static async GetAllProducts(req, res) {
    try {
      const Products = await Product.findAll();

      if (Products.length === 0) {
        res.status(404).json({ message: 'Tidak ada Product yang tersedia.' });
      } else {
        const formattedProducts = Products.map((product) => ({
          id: product.id,
          title: product.title,
          price: formatCurrency(product.price),
          stock: product.stock,
          CategoryId: product.CategoryId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }));

        res.status(200).json(formattedProducts);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async PutProductById(req, res) {
    const { id } = req.params;
    const { price, stock, title } = req.body;

    try {
      const [updatedRowsCount, updatedRows] = await Product.update(
        { price: price, stock: stock, title: title },
        { where: { id }, returning: true }
      );

      if (updatedRowsCount > 0) {
        res.status(200).json({
          id: updatedRows[0].id,
          title: updatedRows[0].title,
          price: formatCurrency(updatedRows[0].price),
          stock: updatedRows[0].stock,
          CategoryId: updatedRows[0].CategoryId,
          createdAt: updatedRows[0].createdAt,
          updatedAt: updatedRows[0].updatedAt,
        });
      } else {
        res.status(404).json({ message: `Product with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async PatchProductById(req, res) {
    const { id } = req.params;
    const { CategoryId } = req.body;

    try {
      const categoryExists = await Category.findOne({
        where: { id: CategoryId },
      });

      if (!categoryExists) {
        return res
          .status(400)
          .json({ message: `Category with id ${CategoryId} not found` });
      }

      const [updatedRowsCount, updatedRows] = await Product.update(
        { CategoryId: CategoryId },
        { where: { id }, returning: true }
      );

      if (updatedRowsCount > 0) {
        const updatedProduct = {
          id: updatedRows[0].id,
          title: updatedRows[0].title,
          price: formatCurrency(updatedRows[0].price),
          stock: updatedRows[0].stock,
          CategoryId: updatedRows[0].CategoryId,
          createdAt: updatedRows[0].createdAt,
          updatedAt: updatedRows[0].updatedAt,
        };

        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: `Product with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async DeleteOneProductById(req, res) {
    const { id } = req.params;
    try {
      const deletedRowCount = await Product.destroy({ where: { id } });

      if (deletedRowCount > 0) {
        res
          .status(200)
          .json({ message: `Product with id ${id} deleted successfully` });
      } else {
        res.status(404).json({ message: `Product with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async CreateProduct(req, res) {
    const { title, price, stock, CategoryId } = req.body;
    try {
      const newProduct = await Product.create({
        title: title,
        price: price,
        stock: stock,
        CategoryId: CategoryId,
      });
      res.status(201).json({
        id: newProduct.id,
        title: newProduct.title,
        price: formatCurrency(newProduct.price),
        stock: newProduct.stock,
        CategoryId: newProduct.CategoryId,
        updatedAt: newProduct.updatedAt,
        createdAt: newProduct.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ProductController;
