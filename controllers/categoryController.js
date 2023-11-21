const { Category, product } = require('../models');

class CategoryController {
  static async GetAllCategories(req, res) {
    try {
      const Categorys = await Category.findAll({
        include: product,
      });

      if (Categorys.length === 0) {
        res.status(404).json({ message: 'Tidak ada category yang tersedia.' });
      } else {
        res.status(200).json(Categorys);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async UpdateOneCategoryById(req, res) {
    const { id } = req.params;
    const { type } = req.body;

    try {
      const [updatedRowsCount, updatedRows] = await Category.update(
        { type: type },
        { where: { id }, returning: true }
      );

      if (updatedRowsCount > 0) {
        res.status(200).json(updatedRows[0]);
      } else {
        res.status(404).json({ message: `Category with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async DeleteOneCategoryById(req, res) {
    const { id } = req.params;
    try {
      const deletedRowCount = await Category.destroy({ where: { id } });

      if (deletedRowCount > 0) {
        res
          .status(200)
          .json({ message: `Category with id ${id} deleted successfully` });
      } else {
        res.status(404).json({ message: `Category with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async CreateCategory(req, res) {
    const { type } = req.body;
    try {
      const newCategory = await Category.create({
        type,
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = CategoryController;
