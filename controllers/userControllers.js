const { User, Photo } = require('../models'); // Change 'user' to 'User'
const { generateToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');

class UserController {
  static async getUsers(req, res) {
    try {
      const userData = await User.findAll({
        include: Photo,
      });

      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async register(req, res) {
    try {
      const { full_name, password, gender, email } = req.body;

      if (!['male', 'female'].includes(gender)) {
        throw {
          code: 400,
          message: 'Invalid gender. Gender must be either "male" or "female".',
        };
      }

      const userData = await User.findOne({
        where: {
          email: email,
        },
      });

      if (userData) {
        throw {
          code: 404,
          message: 'User already registered!',
        };
      }

      const result = await User.create({
        full_name,
        password,
        gender,
        email,
      });

      res.status(201).json({
        id: result.id,
        full_name: result.full_name,
        email: result.email,
        gender: result.gender,
        balance: result.formattedBalance,
        createdAt: result.created,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const userData = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!userData) {
        throw {
          code: 404,
          message: 'user not registered!',
        };
      }

      const isCorrect = comparePassword(password, userData.password);

      if (!isCorrect) {
        throw {
          code: 401,
          message: 'Incorrect password!',
        };
      }

      const token = generateToken({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
      });

      res.status(200).json({
        token,
      });
    } catch (error) {
      res.status(error.code || 500).json(error);
    }
  }

  static async UpdateUserById(req, res) {
    try {
      const id = +req.params.id;

      // Check if ID is provided
      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Bad Request: ID parameter is missing or not a number.',
        });
      }

      const { full_name, email } = req.body;

      const userData = req.UserData;

      if (userData.id !== id) {
        return res.status(403).json({
          message: 'Forbidden: You are not allowed to update this user.',
        });
      }

      const [updatedRowsCount, updatedRows] = await User.update(
        { full_name, email },
        {
          where: {
            id,
          },
          returning: true,
        }
      );

      if (updatedRowsCount > 0) {
        res.status(200).json({
          id: updatedRows[0].id,
          full_name: updatedRows[0].full_name,
          email: updatedRows[0].email,
          createdAt: updatedRows[0].createdAt,
          updatedAt: updatedRows[0].updatedAt,
        });
      } else {
        res.status(404).json({ message: `User with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async DeleteUserById(req, res) {
    try {
      const id = +req.params.id;

      // Check if ID is provided
      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Bad Request: ID parameter is missing or not a number.',
        });
      }

      const userData = req.UserData;

      if (userData.id !== id) {
        return res.status(403).json({
          message: 'Forbidden: You are not allowed to delete this user.',
        });
      }

      const deletedRowCount = await User.destroy({
        where: {
          id,
        },
      });

      if (deletedRowCount > 0) {
        res
          .status(200)
          .json({ message: `Your account has been deleted successfully` });
      } else {
        res.status(404).json({ message: `User with id ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
