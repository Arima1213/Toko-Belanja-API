const { Product } = require('../models');
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
          price: formatCurrency(product.price), // Apply formatting here
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

  static async UpdateOneProductById(req, res) {
    const { id } = req.params;
    const { price, stock, title } = req.body;

    try {
      const [updatedRowsCount, updatedRows] = await Product.update(
        { price: price, stock: stock, title: title },
        { where: { id }, returning: true }
      );

      if (updatedRowsCount > 0) {
        res.status(200).json(updatedRows[0]);
      } else {
        res.status(404).json({ message: `Product with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // static async DeleteOneProductById(req, res) {
  //   const { id } = req.params;
  //   try {
  //     const deletedRowCount = await Product.destroy({ where: { id } });

  //     if (deletedRowCount > 0) {
  //       res
  //         .status(200)
  //         .json({ message: `Product with id ${id} deleted successfully` });
  //     } else {
  //       res.status(404).json({ message: `Product with id ${id} not found` });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

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