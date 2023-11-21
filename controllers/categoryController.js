const { Category } = require('../models');

class CategoryController {
  //   static async GetAllCategorys(req, res) {
  //     try {
  //       const Categorys = await Category.findAll({
  //         include: [Photo, User],
  //       });

  //       if (Categorys.length === 0) {
  //         // Tidak ada komentar ditemukan
  //         res.status(404).json({ message: 'Tidak ada komentar yang tersedia.' });
  //       } else {
  //         // Komentar ditemukan
  //         res.status(200).json(Categorys);
  //       }
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }

  //   static async GetOneCategoryById(req, res) {
  //     const { id } = req.params;
  //     try {
  //       const Category = await Category.findByPk(id, {
  //         include: [User, Photo],
  //       });

  //       if (Category) {
  //         res.status(200).json(Category);
  //       } else {
  //         res.status(404).json({ message: 'Not Found' });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }

  //   static async UpdateOneCategoryById(req, res) {
  //     const userData = req.UserData;
  //     console.log(userData.id);

  //     const { id } = req.params;
  //     const { Category, PhotoId } = req.body;
  //     console.log(Category);

  //     try {
  //       const [updatedRowsCount, updatedRows] = await Category.update(
  //         { Category, UserId: userData.id, PhotoId },
  //         { where: { id }, returning: true }
  //       );

  //       console.log(updatedRowsCount);
  //       console.log(updatedRows);

  //       if (updatedRowsCount > 0) {
  //         res.status(200).json(updatedRows[0]);
  //       } else {
  //         res.status(404).json({ message: `Category with id ${id} not found` });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }

  //   static async DeleteOneCategoryById(req, res) {
  //     const { id } = req.params;
  //     try {
  //       const deletedRowCount = await Category.destroy({ where: { id } });

  //       if (deletedRowCount > 0) {
  //         res
  //           .status(200)
  //           .json({ message: `Category with id ${id} deleted successfully` });
  //       } else {
  //         res.status(404).json({ message: `Category with id ${id} not found` });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }

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
